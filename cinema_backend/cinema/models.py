from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Shows(models.Model):
    movie_title = models.CharField(max_length=120, unique=True)
    room = models.CharField(max_length=120, unique=True)
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,  
        default=0
    )
    available_seats = models.BooleanField(default=True)

    def __str__(self):
        return self.movie_title

class Status (models.TextChoices):
        RESERVED = "RESERVED", "Reservado"
        CONFIRMED = "CONFIRMED", "Confirmado"
        CANCELLED = "CANCELLED", "Cancelado"

class Reservations(models.Model):
    shows = models.ForeignKey(Shows, on_delete=models.PROTECT, related_name="shows")
    customer_name = models.CharField(max_length=120)
    seats = models.IntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(120)]
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RESERVED
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.shows.movie_title} {self.customer_name} ({self.seats} {self.status} {self.created_at})"