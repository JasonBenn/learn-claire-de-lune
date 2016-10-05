import os

from django.core.management import BaseCommand

from piano.s3_utils import upload


class Command(BaseCommand):
    help = 'Upload a .midi file to S3'

    def add_arguments(self, parser):
        parser.add_argument('song_filepath')

    def handle(self, *args, **options):
        song_filepath = options['song_filepath']
        song_file = open(song_filepath, 'rb')
        filename = os.path.basename(song_filepath)
        upload(song_file, filename)