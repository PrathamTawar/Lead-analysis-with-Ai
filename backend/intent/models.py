from django.db import models
from django.contrib.auth.models import User


class Offer(models.Model):
    name = models.CharField(max_length=200)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    value_props = models.TextField()
    ideal_use_cases = models.TextField()
    target_roles = models.TextField(blank=True, null=True)       # comma-separated
    target_industries = models.TextField(blank=True, null=True)  # comma-separated
    created_at = models.DateTimeField(auto_now_add=True)

    def roles_list(self):
        if not self.target_roles:
            return []
        return [x.strip() for x in self.target_roles.split(",") if x.strip()]

    def industries_list(self):
        if not self.target_industries:
            return []
        return [x.strip().lower() for x in self.target_industries.split(",") if x.strip()]

    def __str__(self): return f"{self.name}"


class Lead(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200, blank=True, null=True)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    company = models.CharField(max_length=200, blank=True, null=True)
    industry = models.CharField(max_length=200, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    linkedin_bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f"{self.name} ({self.company or ''})"


class Result(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="results")
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, related_name="results")
    rules_score = models.IntegerField(default=0)
    ai_intent = models.CharField(max_length=10, default="Low")
    final_score = models.IntegerField(default=0)
    reasoning = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("lead", "offer")
        ordering = ("-created_at",)
