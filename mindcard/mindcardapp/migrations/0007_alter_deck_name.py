# Generated by Django 3.2.3 on 2021-08-21 01:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mindcardapp', '0006_auto_20210624_0947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deck',
            name='name',
            field=models.CharField(max_length=280),
        ),
    ]
