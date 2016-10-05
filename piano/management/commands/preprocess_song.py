import tempfile

import jsonpickle
from django.core.management.base import BaseCommand
from mido import MidiFile
from piano.s3_utils import download


class Command(BaseCommand):
    help = 'Download a midi file from a known bucket, translate it into JSON for the client, and upload'

    def add_arguments(self, parser):
        parser.add_argument('song_name')

    def handle(self, *args, **options):
        # songfile = download(options['song_name'])
        midi = MidiFile('/Users/jasonbenn/Desktop/claire-de-lune.midi')
        json = jsonpickle.encode(midi, unpicklable=False)
        file_descriptor, filename = tempfile.mkstemp()

        with open(filename, mode='wb') as fi:
            fi.write(json)

        from IPython import embed; embed()


        # check file is on s3, else error
        # download from s3
        # midi -> json
        # upload
        pass