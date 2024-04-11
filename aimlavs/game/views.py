from django.shortcuts import render
import random

# Create your views here.
def lobby(request):
    context = {'name': random.randint(1, 10)}
    return render(request, 'game/lobby.html', context)