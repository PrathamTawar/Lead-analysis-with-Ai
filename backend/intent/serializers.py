from rest_framework import serializers
from .models import Offer, Lead, Result


class OfferInSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=200)
    value_props = serializers.CharField()
    ideal_use_cases = serializers.CharField()
    target_roles = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )
    target_industries = serializers.ListField(
        child=serializers.CharField(), required=False, allow_null=True
    )


class OfferOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'


class LeadOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'


class ResultOutSerializer(serializers.ModelSerializer):
    lead = LeadOutSerializer(read_only=True)

    class Meta:
        model = Result
        fields = '__all__'
