# Generated by Django 2.2.4 on 2019-08-05 14:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_backend', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='categories',
            field=models.ManyToManyField(related_name='products', to='rest_backend.Category'),
        ),
    ]
