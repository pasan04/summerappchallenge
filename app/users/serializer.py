"""
Purpose:
    This is the main script that is used to render the frontend.
    The script register the blueprints here which used to communicate with the frontend.
Inputs:
    None
Output:
    *render the frontend
Author: Pasan Kamburugamuwa
"""
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']

        extra_kwargs = {
            'password': {'write_only':True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance