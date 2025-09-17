import csv
import requests
import time
from django.core.management.base import BaseCommand

OVERPASS_URL = "http://overpass-api.de/api/interpreter"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
WIKIDATA_URL = "https://www.wikidata.org/w/api.php"
WIKIPEDIA_SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/{title}"

QUERY_TEMPLATE = """
[out:json][timeout:60];
area["name"="{region}"]->.a;
(
  node["tourism"="attraction"](area.a);
  node["tourism"="museum"](area.a);
  node["historic"](area.a);
);
out body;
"""

class Command(BaseCommand):
    help = "Fetch attractions from OSM and enrich with location + Wikipedia description"

    def add_arguments(self, parser):
        parser.add_argument("region", type=str, help="Region name (e.g., Goa, Delhi)")
        parser.add_argument("--output", type=str, default="attractions.csv")

    def reverse_geocode(self, lat, lon):
        try:
            params = {"lat": lat, "lon": lon, "format": "json", "zoom": 10, "addressdetails": 1}
            r = requests.get(NOMINATIM_URL, params=params, headers={"User-Agent": "travista-bot"})
            if r.status_code == 200:
                addr = r.json().get("address", {})
                return (
                    addr.get("city") or addr.get("town") or addr.get("village") or "",
                    addr.get("state", ""),
                    addr.get("country", "")
                )
        except Exception:
            pass
        return ("", "", "")

    def get_wikipedia_summary(self, wikidata_id):
        try:
            # Step 1: Get sitelinks from Wikidata
            params = {"action": "wbgetentities", "ids": wikidata_id, "format": "json", "props": "sitelinks"}
            r = requests.get(WIKIDATA_URL, params=params, headers={"User-Agent": "travista-bot"})
            if r.status_code != 200:
                return ""
            data = r.json()
            sitelinks = data.get("entities", {}).get(wikidata_id, {}).get("sitelinks", {})
            if "enwiki" not in sitelinks:
                return ""
            title = sitelinks["enwiki"]["title"]

            # Step 2: Fetch summary from Wikipedia
            summary_url = WIKIPEDIA_SUMMARY_URL.format(title=title.replace(" ", "_"))
            r = requests.get(summary_url, headers={"User-Agent": "travista-bot"})
            if r.status_code == 200:
                return r.json().get("extract", "")
        except Exception:
            pass
        return ""

    def handle(self, *args, **options):
        region = options["region"]
        output_file = options["output"]
        query = QUERY_TEMPLATE.format(region=region)

        self.stdout.write(self.style.NOTICE(f"Fetching attractions for {region}..."))
        response = requests.post(OVERPASS_URL, data={"data": query})
        if response.status_code != 200:
            self.stderr.write(f"Error fetching OSM data: {response.status_code}")
            return

        elements = response.json().get("elements", [])

        with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([
                "osm_id", "name", "latitude", "longitude",
                "city", "state", "country",
                "address", "description", "wikidata", "tags"
            ])

            for el in elements:
                tags = el.get("tags", {})
                name = tags.get("name")
                if not name:
                    continue

                lat, lon = el.get("lat"), el.get("lon")

                # Try OSM tags first
                city = tags.get("addr:city", "")
                state = tags.get("addr:state", "")
                country = tags.get("addr:country", "")

                # Fallback: reverse geocode
                if not (city and state and country):
                    city, state, country = self.reverse_geocode(lat, lon)
                    time.sleep(1)  # Nominatim rate-limit

                # Description (OSM + Wikipedia)
                desc = tags.get("description", "") or tags.get("note", "")
                wikidata_id = tags.get("wikidata", "")
                if not desc and wikidata_id:
                    desc = self.get_wikipedia_summary(wikidata_id)
                    time.sleep(0.5)  # be gentle

                writer.writerow([
                    el.get("id"),
                    name,
                    lat,
                    lon,
                    city,
                    state,
                    country,
                    tags.get("addr:full", "") or tags.get("addr:street", ""),
                    desc,
                    wikidata_id,
                    str(tags)
                ])

        self.stdout.write(self.style.SUCCESS(f"✅ Saved {len(elements)} attractions to {output_file}"))
