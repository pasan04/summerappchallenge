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
        # token = request.COOKIES.get('jwt')
        #
        # if not token:
        #     raise AuthenticationFailed("Unauthenticated!")
        #
        # try:
        #     payload = jwt.decode(token, 'secret', algorithms=["HS256"])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed("Token expired. Please log in again.")
        # except jwt.InvalidTokenError:
        #     raise AuthenticationFailed("Invalid token. Please log in again.")

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