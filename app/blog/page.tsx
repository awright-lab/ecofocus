import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StickyButtons from '../../components/StickyButtons';
import BlogHero from './BlogHero';
import FeaturedArticles from './FeaturedArticles';
import BlogCategories from './BlogCategories';
import RecentArticles from './RecentArticles';
import NewsletterSection from './NewsletterSection';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BlogHero />
      <FeaturedArticles />
      <BlogCategories />
      <RecentArticles />
      <NewsletterSection />
      <Footer />
      <StickyButtons />
    </div>
  );
}