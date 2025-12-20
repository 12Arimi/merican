"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  created_at: string;
}

const Blogs = ({ initialData }: { initialData: Blog[] }) => {
  const [allBlogs] = useState<Blog[]>(initialData);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");

  const imageBasePath = 'https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/blog/';

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setSearchQuery(rawValue);
    
    const cleanQuery = rawValue.toLowerCase().trim();
    
    if (cleanQuery === "") {
      setFilteredBlogs(allBlogs);
    } else {
      const filtered = allBlogs.filter(blog => 
        blog.title.toLowerCase().includes(cleanQuery) || 
        blog.content.toLowerCase().includes(cleanQuery)
      );
      setFilteredBlogs(filtered);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredBlogs(allBlogs);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <>
      <section className="merican-page-banner">
        <div className="merican-banner-overlay">
          <h1 className="merican-banner-title">Blog</h1>
        </div>
      </section>

      <section className="merican-blogs">
        <div className="merican-blogs-container">
          
          <div className="blog-search">
            <div className="search-input-wrapper" style={{ position: 'relative' }}>
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                id="blogSearchInput" 
                placeholder="Search blogs by title or content..." 
                value={searchQuery}
                onChange={handleSearch}
                autoComplete="off"
                style={{ paddingRight: '40px' }} 
              />
              {/* Clear Search "X" Icon */}
              {searchQuery && (
                <i 
                  className="fa-solid fa-xmark" 
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontSize: '18px'
                  }}
                ></i>
              )}
            </div>
          </div>

          <div className="merican-blogs-grid">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => {
                const plainText = stripHtml(blog.content);
                const excerpt = plainText.length > 200 
                  ? plainText.slice(0, 200) + '...' 
                  : plainText;

                return (
                  <div key={blog.id} className="merican-blog-card">
                    <div className="merican-blog-image">
                      <img src={`${imageBasePath}${blog.cover_image}`} alt={blog.title} />
                    </div>
                    <div className="merican-blog-content">
                      <h3 className="merican-blog-title">{blog.title}</h3>
                      <p className="merican-blog-excerpt">{excerpt}</p>
                      <Link href={`/blog/${blog.slug}`} className="merican-blog-readmore">
                        Read More
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', gridColumn: '1 / -1', padding: '40px' }}>
                No blogs found matching your search.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;