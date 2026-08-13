from rest_framework import serializers

class MovieCatalogSerializer(serializers.Serializer):
    movie_title = serializers.CharField(max_length=120)
    genre = serializers.CharField(max_length=120)
    duration_min = serializers.IntegerField(required=False, min_value=0)
    rating = serializers.CharField(max_length=120)
    is_active = serializers.BooleanField(default=True)

class Estado:
        CREATED = "Creado"
        CONFIRMED = "Confirmado"
        CANCELADO = "Cancelado"
        CHECKED_IN = "Chequeo"

        CHOICES = [
            (CREATED, "Creado"),
            (CONFIRMED, "Confirmado"),
            (CANCELADO, "Cancelado"),
            (CHECKED_IN, "Chequeo")
        ]

class Source:
        WEB = "Web"
        MOBILE = "Celular"
        SYSTEM = "Sistema"

        CHOICES = [
            (WEB, "Web"),
            (MOBILE, "Celular"),
            (SYSTEM, "Sistema")
        ]

class ReservationEventsSerializer(serializers.Serializer):
    reservation_id = serializers.IntegerField()        # ID de Vehiculo (Postgres)
    estado = serializers.ChoiceField(choices=Estado.CHOICES,default=Estado.CREATED)
    source = serializers.ChoiceField(choices=Source.CHOICES,default=Source.WEB)
    note = serializers.CharField(max_length=120)
    created_at = serializers.DateTimeField(required=False)