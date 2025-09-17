import csv
import requests
from django.core.management.base import BaseCommand

OVERPASS_URL = "http://overpass-api.de/api/interpreter"

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
    help = "Fetch attractions from OSM and save them into a CSV file"

    def add_arguments(self, parser):
        parser.add_argument("region", type=str, help="Region name (e.g., Goa, Delhi)")
        parser.add_argument(
            "--output", type=str, default="attractions.csv",
            help="Output CSV filename (default: attractions.csv)"
        )

    def handle(self, *args, **options):
        region = options["region"]
        output_file = options["output"]
        query = QUERY_TEMPLATE.format(region=region)

        self.stdout.write(self.style.NOTICE(f"Fetching attractions for {region}..."))
        response = requests.post(OVERPASS_URL, data={"data": query})

        if response.status_code != 200:
            self.stderr.write(f"Error fetching data: {response.status_code}")
            return

        data = response.json()
        elements = data.get("elements", [])

        with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["osm_id", "name", "latitude", "longitude", "address", "wikidata", "tags"])

            for el in elements:
                tags = el.get("tags", {})
                name = tags.get("name")
                if not name:
                    continue

                writer.writerow([
                    el.get("id"),
                    name,
                    el.get("lat"),
                    el.get("lon"),
                    tags.get("addr:full", "") or tags.get("addr:street", ""),
                    tags.get("wikidata", ""),
                    str(tags)
                ])

        self.stdout.write(self.style.SUCCESS(f"✅ Saved {len(elements)} attractions to {output_file}"))
