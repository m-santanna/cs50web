from django.shortcuts import render
from django.http import HttpResponseNotFound, HttpResponseRedirect
from . import util
from django import forms
from django.urls import reverse

class Search(forms.Form):
    searchbar = forms.CharField(widget=forms.TextInput(attrs={'class' : 'search', 'placeholder': 'Search'}))

def index(request):

    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "searchbar":Search()
    })

def wiki(request, wiki):
   
    if util.get_entry(wiki):
        for entry in util.list_entries():
            if wiki.lower() == entry.lower():
                wiki = entry
        return render(request, 'encyclopedia/wiki.html', {
            "wiki":wiki,
            "content":util.get_entry(wiki),
            "searchbar":Search()
        })
    else: return HttpResponseNotFound()

def search(request):
    strings = []
    if request.method == 'POST':
        form = Search(request.POST)
        if form.is_valid():
            substring = form.cleaned_data["searchbar"].lower()
 
            for entry in util.list_entries():
                if substring == entry.lower():
                    return HttpResponseRedirect(f'wiki/{entry}')
                
                elif substring in entry.lower():
                    strings.append(entry)
            return render(request, 'encyclopedia/search.html', {
                "strings":strings,
                "searchbar":Search()
            })
    else:
        return render(request, 'encyclopedia/search.html', {
            "strings":strings,
            "searchbar":Search()
        })
