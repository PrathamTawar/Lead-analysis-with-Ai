from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status, throttling, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Offer, Lead, Result
from .serializers import (
    OfferInSerializer, OfferOutSerializer,
    LeadOutSerializer, ResultOutSerializer
)
from .utils import parse_leads_csv
from .scoring import ai_analysis_for


# POST /offer
class OfferView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        q = Offer.objects.filter(added_by=request.user)
        serializer = OfferOutSerializer(q, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        user = request.user
        s = OfferInSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        data = s.validated_data
        print('data---------', data)
        offer = Offer.objects.create(
            name=data["name"],
            added_by=user,
            value_props=data["value_props"],
            ideal_use_cases=data["ideal_use_cases"],
            target_roles=",".join(data.get("target_roles") or []),
            target_industries=",".join(data.get("target_industries") or []),
        )
        return Response(OfferOutSerializer(offer).data, status=status.HTTP_201_CREATED)


# POST /leads/upload
class Leads(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        q = Lead.objects.filter(added_by=request.user)
        s = LeadOutSerializer(q, many=True)
        return Response(s.data, status=200)


    @transaction.atomic
    def post(self, request):
        user = request.user
        file = request.FILES.get("file")
        if not file:
            return Response({"detail": "CSV file field name must be 'file'."}, status=400)
        try:
            rows = parse_leads_csv(file)
        except Exception as e:
            return Response({"detail": f"Invalid CSV: {e}"}, status=400)

        created = []
        for r in rows:
            lead = Lead.objects.create(**r, added_by=user)
            created.append(lead)

        return Response({"count": len(created), "leads": LeadOutSerializer(created, many=True).data}, status=201)


# POST /score
class ScoreRun(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def get(self, request):
        offer_id = request.query_params.get('offer_id')
        if not offer_id:
            return Response("offer_id is required", status=400)

        # Use latest offer if not passed
        offer = get_object_or_404(Offer, id=offer_id)
        if not offer:
            return Response({"detail": "No offer found. Create one via /offer."}, status=400)

        # Score all leads that don't have a result for this offer yet
        leads = Lead.objects.filter(added_by=request.user, results__isnull=True)
        if not leads:
            return Response("No leads to score. Or leads scored already.", status=404)
        results_payload = []
        skipped = []

        for lead in leads:
            if Result.objects.filter(lead=lead, offer=offer).exists():
                continue

            lead_dict = {
                "name": lead.name, "role": lead.role, "company": lead.company,
                "industry": lead.industry, "location": lead.location, "linkedin_bio": lead.linkedin_bio
            }
            print("-----------------running ai for----------------", lead_dict, offer)
            try:
                ai_obj = ai_analysis_for(offer, lead_dict)
            except Exception as e:
                print("failed while ai scoring", e)
                skipped.append(lead.name)
                continue
                # dict: {intent, reasoning}

            res = Result.objects.create(
                lead=lead, offer=offer,
                ai_intent=ai_obj.get("intent", "Low").title(),
                reasoning=ai_obj.get("reasoning", ""),
                final_score=ai_obj.get("score", 0)
            )

            res = ResultOutSerializer(res)

            results_payload.append(res.data)

        return Response({"processed": len(results_payload), "skipped": skipped, "results": results_payload}, status=200)


# GET /results
class ResultsList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        q = Result.objects.filter(lead__added_by=request.user).select_related("lead", "offer").order_by("-created_at")
        print(q)
        serializer = ResultOutSerializer(q, many=True)
        return Response(serializer.data, status=200)
