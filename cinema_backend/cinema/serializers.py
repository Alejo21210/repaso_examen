from rest_framework import serializers
from .models import Shows, Reservation

class ShowsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shows
        fields = ["id", "movie_title", "room", "price", "available_seats"]

class ReservationSerializer(serializers.ModelSerializer):
    shows_movie_title = serializers.CharField(source="shows.movie_title", read_only=True)

    class Meta:
        model = Reservation
        fields = ["id", "shows", "shows_movie_title", "customer_name", "seats", "status", "created_at"]