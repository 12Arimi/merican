const Categories = () => {
  return (
    <section className="merican-categories">
      <div className="merican-categories-container">
        <h2 className="merican-categories-title">Our Categories</h2>

        <div className="merican-categories-grid">
          {/* 1: Receiving Area */}
          <a href="/category/receiving" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/receiving-area.jpg" alt="Receiving Area" />
            </div>
            <p className="merican-category-text">Receiving Area</p>
          </a>

          {/* 2: Storage Area */}
          <a href="/category/storage" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/storage-area.jpg" alt="Storage Area" />
            </div>
            <p className="merican-category-text">Storage Area</p>
          </a>

          {/* 3: Preparation Section */}
          <a href="/category/preparation" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/preparation-section.jpg" alt="Preparation Section" />
            </div>
            <p className="merican-category-text">Preparation Section</p>
          </a>

          {/* 4: Production Section */}
          <a href="/category/production" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/production-section.jpg" alt="Production Section" />
            </div>
            <p className="merican-category-text">Production Section</p>
          </a>

          {/* 5: Servery / Dispatch */}
          <a href="/category/dispatch-servery" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/servery-dispatch-section.jpg" alt="Servery / Dispatch Section" />
            </div>
            <p className="merican-category-text">Servery / Dispatch Section</p>
          </a>

          {/* 6: Wash-up Area */}
          <a href="/category/wash-up-area" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/wash-up-area.jpg" alt="Wash-up Area" />
            </div>
            <p className="merican-category-text">Wash-up Area</p>
          </a>

          {/* 7: Bar Area */}
          <a href="/category/bar-area" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/bar-section.jpg" alt="Bar Section" />
            </div>
            <p className="merican-category-text">Bar Area</p>
          </a>

          {/* 8: Commercial Kitchen Gas Section */}
          <a href="/category/gas-section" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-gas-section.jpg" alt="Commercial Kitchen Gas Section" />
            </div>
            <p className="merican-category-text">Commercial Kitchen Gas Section</p>
          </a>

          {/* 9: Stainless Steel Fabrication */}
          <a href="/category/stainless-steel-fabrication" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/stainless-steel-fabrication.jpg" alt="Stainless Steel Fabrication" />
            </div>
            <p className="merican-category-text">Stainless Steel Fabrication</p>
          </a>

          {/* 10: Commercial Kitchen Support */}
          <a href="/category/kitchen-support" className="merican-category-card">
            <div className="merican-category-image">
              <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/commercial-kitchen-support.jpg" alt="Commercial Kitchen Support" />
            </div>
            <p className="merican-category-text">Commercial Kitchen Support</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Categories;
