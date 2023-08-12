from django.shortcuts import render

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def wiki(request, wiki):
    if util.get_entry(wiki):
        return render(request, 'encyclopedia/wiki.html', {
            "wiki":wiki.capitalize(),
            "content":util.get_entry(wiki)
        })
