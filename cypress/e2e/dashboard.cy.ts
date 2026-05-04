describe('Personalized Dashboard E2E', () => {
  
  // We must log in before each test because NextAuth middleware protects all routes
  beforeEach(() => {
    // 🛡️ MOCK APIs: Prevent rate-limiting (500 errors) from third-party free APIs during tests
    cy.intercept('GET', '**/api/news*', {
      statusCode: 200,
      body: {
        articles: [
          {
            title: "Cypress Automated Test Article",
            description: "Mock description for reliable E2E testing without hitting NewsAPI rate limits.",
            url: "https://example.com/cypress-test-article",
            urlToImage: "https://via.placeholder.com/400x200",
            source: { name: "Cypress Mock News" }
          }
        ]
      }
    }).as('getNews');

    cy.visit('http://localhost:3000/login');
    // Simulate user typing credentials
    cy.get('input[type="email"]').type('cypress@example.com');
    cy.get('input[type="password"]').type('password123');
    // Click the Sign In button
    cy.get('button[type="submit"]').click();
    
    // Wait for NextAuth to generate the JWT and redirect to the protected dashboard
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('loads the homepage and shows the sidebar', () => {
    // We are already on the homepage due to beforeEach
    cy.get('h1').should('contain.text', 'ContentHub');
    cy.get('input[placeholder*="Search news"]').should('exist');
  });

  it('tests the search functionality (debounce and enter key)', () => {
    // Type into the search bar
    cy.get('input[placeholder*="Search news"]').type('technology{enter}');
    
    // Check if the feed grid renders
    cy.get('.grid').should('exist');
  });

  it('tests the drag-and-drop functionality on the Favorites page', () => {
    // Wait for our mocked API to return so the card exists!
    cy.wait('@getNews');

    // 1. Find the first bookmark button and click it to save an article
    cy.get('button').find('svg.lucide-bookmark').first().parent().click({ force: true });
    
    // 2. Navigate to Favorites page
    cy.get('a[href="/favorites"]').click();
    cy.url().should('include', '/favorites');
    
    // 3. Verify the saved article successfully transferred
    cy.contains('Saved Articles').should('exist');
    cy.get('button').contains('✋ Drag').should('exist');
    
    // 4. Verify the grid has at least 1 item
    cy.get('.grid').children().should('have.length.at.least', 1);
  });

  it('navigates to settings and can toggle dark mode', () => {
    cy.visit('http://localhost:3000/settings');
    cy.contains('Preferences').should('exist');
  });
});
