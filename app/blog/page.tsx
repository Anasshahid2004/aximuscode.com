import type { Metadata } from "next";
import PageBreadcrumb from "@/app/components/shared/PageBreadcrumb";
import BlogSearchForm from "./BlogSearchForm";

export const metadata: Metadata = {
  title: "Blog - Nimo",
  description: "Explore industry insights, expert tips, and creative inspiration from the Nimo team.",
};

// Ports index.php + post-formats/content.php's list-view archive
// (.tz-blog-item.list-view-item) plus sidebar.php's `dynamic_sidebar(
// 'blog-sidebar' )` (search / categories / recent posts / tags widgets,
// styled via .tz-sidebar-widget in nimo-extra.css). The theme's Blog page
// carries no _elementor_data (it's a plain WP archive template, not an
// Elementor page), so this is built from the 4 real "post" entries in
// content.xml directly (post_id 1169/1177/1179/1181) - their real titles,
// categories, tags and featured images, not the "Nimo Wins..." override
// titles used by the tx_post_grid teaser elsewhere on the site.
const POSTS = [
  {
    id: "1181",
    title: "Get The Most Out Og The Creativity",
    image: "/images/b1-img-1.webp",
    date: "2024-01-10",
    categories: ["Clock Fly Strategy", "Digital Marketing"],
  },
  {
    id: "1179",
    title: "SEO: Which Digital Advertis Ing Strategy Is Right For You?",
    image: "/images/p2-img-1.webp",
    date: "2024-01-10",
    categories: ["Email Marketing", "Web Development"],
  },
  {
    id: "1177",
    title: "Influencer Marketing Trends 2023: What You Need Know",
    image: "/images/cta-2-bg-img-1.webp",
    date: "2024-01-10",
    categories: ["Clock Fly Strategy", "Digital Strategy"],
  },
  {
    id: "1169",
    title: "Social Media Marketing Strategies For Small Business",
    image: "/images/b1-img-3.webp",
    date: "2024-01-10",
    categories: ["Brand Design Identity", "Digital Marketing"],
  },
];

const EXCERPT =
  "Aliquam metus nibh consectetuer montes nascetur quisque lobortis a aliquet diam. Egestas dapibus hen drerit nascetur etiam sociosqu. Himenaeos interdum tortor augue malesuada id. F...";

const CATEGORIES = [
  { name: "Brand Design Identity", count: 1 },
  { name: "Clock Fly Strategy", count: 2 },
  { name: "Digital Marketing", count: 2 },
  { name: "Digital Strategy", count: 1 },
  { name: "Email Marketing", count: 1 },
  { name: "Web Development", count: 1 },
];

const TAGS = ["Agency", "Business", "Digital", "Digital Agency", "Marketing", "Product", "Startup", "Technology", "Trendy"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPage() {
  const recentPosts = POSTS.slice(0, 3);

  return (
    <main>
      <PageBreadcrumb title="Blog" current="Blog" />
      <div className="tx-blog-area tz-blog-list-sec pt-110 pb-120 fix">
        <div className="container nm-container-1">
          <div className="row">
            <div className="col-xxl-8 col-xl-8 col-lg-8">
              <div className="blog__wrapper blog-list-content mt-none-30">
                {POSTS.map((post) => (
                  <article key={post.id} className="tx-blog-box mt-30">
                    <div className="tz-blog-item list-view-item">
                      <div className="item-img">
                        <img src={post.image} alt={post.title} className="img-responsive w-100" />
                      </div>
                      <div className="item-text headline pera-content">
                        <div className="item-meta">
                          <a href="#">
                            <i className="fa-regular fa-calendar" /> {formatDate(post.date)}
                          </a>
                          <a href="#">
                            <i className="fa-regular fa-user" /> nimo
                          </a>
                          <a href="#">
                            <i className="fa-solid fa-comments" /> Comments(0)
                          </a>
                        </div>
                        <h3 className="blog_title">
                          <a href="#" aria-label={post.title}>
                            {post.title}
                          </a>
                        </h3>
                        <p>{EXCERPT}</p>
                        <a className="read_more" href="#">
                          Read More <i className="fa-solid fa-angles-right" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="col-xxl-4 col-xl-4 col-lg-4 mt-30 mt-lg-0">
              <div className="tx-sidebarWrapper tz-ser-sidebar">
                <div className="tz-sidebar-widget search-widget">
                  <h3 className="widget-title">Search</h3>
                  <BlogSearchForm />
                </div>

                <div className="tz-sidebar-widget">
                  <h3 className="widget-title">Categories</h3>
                  <ul className="category-widget list-unstyled mb-0 pl-0">
                    {CATEGORIES.map((cat) => (
                      <li key={cat.name}>
                        <a href="#">
                          <span>{cat.name}</span>
                          <span>({cat.count})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tz-sidebar-widget">
                  <h3 className="widget-title">Recent Posts</h3>
                  {recentPosts.map((post) => (
                    <div className="tz-rcw-item" key={post.id}>
                      <div className="item-img">
                        <img src={post.image} alt={post.title} />
                      </div>
                      <div className="item-text">
                        <div className="item-meta">
                          <a href="#">
                            <i className="fa-regular fa-calendar" /> {formatDate(post.date)}
                          </a>
                          <a href="#">
                            <i className="fa-regular fa-user" /> By nimo
                          </a>
                        </div>
                        <h3>
                          <a href="#" aria-label={post.title}>
                            {post.title}
                          </a>
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="tz-sidebar-widget">
                  <h3 className="widget-title">Popular Tags</h3>
                  <ul className="tag-widget list-unstyled mb-0 pl-0 d-flex flex-wrap">
                    {TAGS.map((tag) => (
                      <li key={tag}>
                        <a href="#">{tag}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
