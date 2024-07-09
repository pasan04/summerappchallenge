from django.shortcuts import render
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response
import re
import jwt
import os
from rest_framework.exceptions import AuthenticationFailed

DIR = '/Users/pkamburu/summerappchallenge/app/data'

class readFolder(APIView):
    # Read file names within a folder, remove non-numeric names. (like .DS_store)
    def get(self, request):
        files_path = Path(DIR)
        years = []
        for entry in files_path.iterdir():
            if entry.is_file():
                match = re.match(r'^\d{4}$', entry.stem)
                if match:
                    years.append(entry.stem)
        years.sort(reverse=True)
        return Response(years)

class readDataFile(APIView):
    def post(self, request):
        results = []
        year = request.data.get('year')
        project_file = os.path.join(DIR, year)
        file = open(project_file, "r")
        for line in file:
            word = re.split('\:', line)
            data = {
                'date' : word[0],
                'count': word[1]
            }
            results.append(data)
        return Response(results)

class getStat(APIView):
    def get(self, request):
        results = []
        total_count = 0
        date_count = 0
        counts = []

        # Iterate through each file in the main directory
        for filename in os.listdir(DIR):
            file_path = os.path.join(DIR, filename)
            if os.path.isfile(file_path):  # Ensure it's a file
                try:
                    with open(file_path, "r", encoding='utf-8', errors='ignore') as file:
                        for line in file:
                            # Split by the first occurrence of ':', allowing for more than one occurrence of ':'
                            parts = line.split(':', 1)
                            if len(parts) == 2:
                                date_part = parts[0].strip()
                                count_part = parts[1].strip()

                                if re.match(r'\d{4}-\d{2}-\d{2}', date_part):
                                    try:
                                        count = int(count_part)
                                        results.append({'date': date_part, 'count': count})
                                        total_count += count
                                        counts.append((date_part, count))
                                        date_count += 1
                                    except ValueError:
                                        # Handle the case where count_part is not a valid integer
                                        pass
                except Exception as e:
                    return Response({"error": str(e)}, status=500)

        if date_count == 0:
            return Response({"error": "No valid data found"}, status=400)

        average_count = total_count / date_count
        highest = max(counts, key=lambda x: x[1])
        lowest = min(counts, key=lambda x: x[1])

        response_data = {
            'total_dates': date_count,
            'total_counts': total_count,
            'average_counts': average_count,
            'highest_count': {
                'date': highest[0],
                'count': highest[1]
            },
            'lowest_count': {
                'date': lowest[0],
                'count': lowest[1]
            }
        }

        return Response(response_data)