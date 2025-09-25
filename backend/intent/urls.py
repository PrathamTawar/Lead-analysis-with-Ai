from django.urls import path
from .views import OfferView, Leads, ScoreRun, ResultsList

urlpatterns = [
    path("offer/", OfferView.as_view()),
    path("leads/upload/", Leads.as_view()),
    path("score/", ScoreRun.as_view()),
    path("results/", ResultsList.as_view()),
]
