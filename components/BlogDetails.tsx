"use client";

import React from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  created_at: string;
}

interface BlogDetailsProps {
  initialBlog: Blog;
  initialPopular: Blog[];
}

const BlogDetails = ({ initialBlog, initialPopular }: BlogDetailsProps) => {
  const imageBasePath = 'https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/blog/';

  const formattedDate = new Date(initialBlog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">Blog Details</h1>
        </div>
      </section>

      <section className="bd-blog-details">
        <div className="bd-blog-details-container">
          <div className="bd-layout">
            
            {/* Main Content */}
            <main className="bd-main-content">
              <article className="bd-blog-article">
                <header className="bd-blog-header">
                  <h1 className="bd-blog-detail-title">{initialBlog.title}</h1>
                  <div className="bd-blog-meta">
                    <span className="bd-blog-date">
                      <i className="fa-solid fa-calendar-days" style={{ marginRight: '8px' }}></i> 
                      {formattedDate}
                    </span>
                  </div>
                  <div className="bd-blog-cover-image">
                    <img 
                      src={`${imageBasePath}${initialBlog.cover_image}`} 
                      alt={initialBlog.title} 
                    />
                  </div>
                </header>

                {/* Render HTML content safely */}
                <div 
                  className="bd-blog-body"
                  dangerouslySetInnerHTML={{ __html: initialBlog.content }}
                />

                <footer className="bd-blog-footer">
                  <Link href="/blog" className="bd-back-to-blogs">
                    <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i> 
                    Back to Blogs
                  </Link>
                </footer>
              </article>
            </main>

            {/* Sidebar: Popular Blogs */}
            <aside className="bd-sidebar">
              <div className="popular-blogs-section">
                <h3 className="popular-blogs-title">Popular Blogs</h3>
                <div className="popular-blogs-list">
                  {initialPopular.length > 0 ? (
                    initialPopular.map((pBlog) => (
                      <div key={pBlog.id} className="popular-blog-card">
                        <Link href={`/blog/${pBlog.slug}`} className="popular-blog-link">
                          <div className="popular-blog-image">
                            <img 
                              src={`${imageBasePath}${pBlog.cover_image}`} 
                              alt={pBlog.title} 
                            />
                          </div>
                          <div className="popular-blog-info">
                            <h4 className="popular-blog-title">{pBlog.title}</h4>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="no-other-blogs">No other blogs available.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;