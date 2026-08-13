from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Shows, Reservation
from .serializers import ShowsSerializer, ReservationSerializer
from .permissions import IsAdminOrReadOnly

class ShowsViewSet(viewsets.ModelViewSet):
    queryset = Shows.objects.all().order_by("id")
    serializer_class = ShowsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["movie_title"]
    ordering_fields = ["id", "movie_title", "room", "price", "available_seats"]

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.select_related("shows").all().order_by("-id")
    serializer_class = ReservationSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["shows"]
    search_fields = ["shows__movie_title"]
    ordering_fields = ["id", "customer_name","seats", "status", "created_at"]


    def get_permissions(self):
        # Público: SOLO listar Reservaciones
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()