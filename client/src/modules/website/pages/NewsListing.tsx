import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Calendar, ChevronLeft, ChevronRight,
  Grid3X3, List, Search, User, Clock, ArrowLeft
} from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

const ITEMS_PER_PAGE = 8;

type ViewMode = "list" | "grid";

// Breadcrumb Component with Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${window.location.origin}${item.url}`
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center gap-2">
              {index > 0 && <span className="text-muted-foreground">/</span>}
              {index === items.length - 1 ? (
                <span className="text-muted-foreground">{item.name}</span>
              ) : (
                <Link 
                  to={item.url} 
                  className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  {index === 0 && <ArrowLeft className="w-4 h-4" />}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default function NewsListing() {
  const { items, title } = siteContent.text.news;
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Hotel", "Restaurant", "Events", "Awards"];

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", url: "/" },
    { name: "News", url: "/news" }
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || true;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">

          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Compact Header Line */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            {/* Title & Count */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-serif font-bold">{title}</h1>
              <span className="px-3 py-1 bg-secondary text-sm rounded-full text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? "article" : "articles"}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-40 md:w-52 pl-9 pr-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All" : cat}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {searchQuery && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Searching:</span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-2">
                "{searchQuery}"
                <button onClick={() => handleSearch("")} className="hover:text-primary/70">×</button>
              </span>
            </div>
          )}

          {/* No Results */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => { handleSearch(""); handleCategoryChange("all"); }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Articles */}
          {filteredItems.length > 0 && (
            <>
              {viewMode === "list" ? (
                <div className="space-y-4">
                  {currentItems.map((item) => (
                    <Link
                      to={`/news/${item.slug}`}
                      key={item.slug}
                      className="group flex flex-col sm:flex-row bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative w-full sm:w-48 md:w-56 lg:w-64 flex-shrink-0 aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                          {...item.image}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                            Hotel
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-primary" />
                            {item.date}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <User className="w-3 h-3 text-primary" />
                            Kennedia Team
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-primary" />
                            5 min
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base md:text-lg font-serif font-bold leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="hidden md:flex items-center gap-1.5">
                            {["Hospitality", "Luxury"].map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-secondary text-[10px] rounded-full text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <span className="flex items-center text-sm font-semibold text-primary">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {currentItems.map((item) => (
                    <Link
                      to={`/news/${item.slug}`}
                      key={item.slug}
                      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                          {...item.image}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                            Hotel
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                          <Calendar className="w-3 h-3 text-primary" />
                          {item.date}
                          <span className="mx-0.5">•</span>
                          <Clock className="w-3 h-3 text-primary" />
                          5 min
                        </div>
                        <h3 className="text-sm font-serif font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 flex-1">
                          {item.description}
                        </p>
                        <div className="flex items-center text-xs font-semibold text-primary mt-auto">
                          Read Story
                          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
                  {/* Page Info */}
                  <p className="text-sm text-muted-foreground order-2 sm:order-1">
                    Page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
                  </p>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-1 order-1 sm:order-2">
                    {/* Previous */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 mx-1">
                      {getPageNumbers().map((page, idx) => (
                        page === "..." ? (
                          <span key={`ellipsis-${idx}`} className="px-1.5 text-muted-foreground text-sm">...</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => goToPage(page as number)}
                            className={`w-8 h-8 rounded-lg font-medium text-sm transition-all ${currentPage === page
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "border border-border hover:bg-secondary"
                              }`}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Next */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Jump */}
                  <div className="hidden lg:flex items-center gap-2 order-3">
                    <span className="text-sm text-muted-foreground">Go to:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      placeholder="#"
                      className="w-14 px-2 py-1 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-center"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const value = parseInt((e.target as HTMLInputElement).value);
                          if (value >= 1 && value <= totalPages) {
                            goToPage(value);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}