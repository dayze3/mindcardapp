from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.
class Deck(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=280, unique=False)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class Card(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, null=True)
    order = models.PositiveSmallIntegerField(default=0)
    front = models.CharField(max_length=280)
    back = models.CharField(max_length=280)
    def __str__(self):
        return self.front, self.back