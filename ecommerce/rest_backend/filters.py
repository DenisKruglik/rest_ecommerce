from rest_framework import filters


class ProductInCategoryFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        category = request.query_params.get('category')
        if category:
            try:
                category = int(category)
            except ValueError:
                return queryset
            else:
                return queryset.filter(categories__id=category)
        return queryset
