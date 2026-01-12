import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Share2 } from "lucide-react";
import Navbar from "@/modules/website/components/Navbar";
import Footer from "@/modules/website/components/Footer";
import { siteContent } from "@/data/siteContent";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import NotFound from "./not-found";

export default function NewsDetails() {
  const { id } = useParams();
  const { items } = siteContent.text.news;
  const newsItem = items.find((n) => n.slug === id);

  if (!newsItem) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {newsItem.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> Kennedia Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              {newsItem.title}
            </h1>
          </header>

          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl mb-12">
            <OptimizedImage
              {...newsItem.image}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-xl leading-relaxed font-serif text-foreground/80 mb-6 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-primary">
              {newsItem.description}
            </p>
            <p>
              At Kennedia Blu, we are constantly striving for specific goals. This achievement marks a significant milestone in our journey.
              We continue to push the boundaries of luxury hospitality.
            </p>
            <p>
              "We are incredibly proud of this recognition," says the CEO. "It reflects the hard work and dedication of our entire team."
            </p>
            <h3>Looking Ahead</h3>
            <p>
              The future holds exciting possibilities. We are committed to maintaining our high standards and delivering exceptional experiences for our guests worldwide.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
            <span className="font-serif font-bold text-lg">Share this article</span>
            <div className="flex gap-4">
              <button className="p-2 rounded-full border border-border hover:bg-secondary transition-colors"><Share2 className="w-5 h-5" /></button>
            </div>
          </div>

        </article>
      </main>
      <Footer />
    </div>
  );
}
