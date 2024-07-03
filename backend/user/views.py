from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser

# Create your views here.
@api_view(["POST"])
def logout_user(request):
    if request.method == "POST":
        # Check if the user is authenticated
        if isinstance(request.user, AnonymousUser):
            return Response({"Error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        # Attempt to delete the token
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response({"Message": "You are logged out"}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"Error": "Token not found"}, status=status.HTTP_400_BAD_REQUEST)
