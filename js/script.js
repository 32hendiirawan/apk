function apkGallery() {
    return {
        view: 'gallery',
        search: '',
        category: 'all',
        sortBy: 'latest',
        errorLoading: false,
        selectedApp: {},
        currentSlide: 0,
        apps: [],

        init() {
            const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyFRUWJmpdQzBsnlL8VaWA_eot4_jMw6XUMLsW5jbKBdz4UKrzqYtYcP7LpM9fJmGKqbA/exec";
            
            fetch(WEB_APP_URL)
                .then(res => res.json())
                .then(data => {
                    this.apps = data;
                })
                .catch(err => {
                    console.error("Gagal memuat database produk:", err);
                    this.errorLoading = true;
                });
        },

        get uniqueCategories() {
            return [...new Set(this.apps.map(a => a.category))];
        },

        get filteredApps() {
            let filtered = this.apps.filter(app => {
                const searchLower = this.search.toLowerCase();
                const matchSearch = app.name.toLowerCase().includes(searchLower) || 
                                    app.shortDesc.toLowerCase().includes(searchLower);
                const matchCat = this.category === 'all' || app.category === this.category;
                return matchSearch && matchCat;
            });

            if (this.sortBy === 'cheap') return filtered.sort((a, b) => a.price - b.price);
            if (this.sortBy === 'expensive') return filtered.sort((a, b) => b.price - a.price);
            return filtered.sort((a, b) => b.id - a.id);
        },

        formatCurrency(val) {
            return new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR', 
                maximumFractionDigits: 0 
            }).format(val);
        },

        showDetails(app) {
            this.selectedApp = app;
            this.currentSlide = 0;
            this.view = 'detail';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        backToGallery() {
            this.view = 'gallery';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        nextSlide() {
            if(this.selectedApp.screenshots && this.selectedApp.screenshots.length) {
                this.currentSlide = (this.currentSlide + 1) % this.selectedApp.screenshots.length;
            }
        },

        prevSlide() {
            if(this.selectedApp.screenshots && this.selectedApp.screenshots.length) {
                this.currentSlide = (this.currentSlide - 1 + this.selectedApp.screenshots.length) % this.selectedApp.screenshots.length;
            }
        }
    }
}
