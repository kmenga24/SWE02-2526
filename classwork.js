// Quotes API Integration
// Classwork 02 - Consuming a 3rd Party API

// TODO: Replace with your actual RapidAPI key
const RAPIDAPI_KEY = 'a06d3c359dmsh364e9efbced04f7p1009d4jsn24a8133427cb';
const RAPIDAPI_HOST = 'quotes-by-api-ninjas.p.rapidapi.com';

const quoteTextEl = document.getElementById('quoteText');
const quoteAuthorEl = document.getElementById('quoteAuthor');
const getQuoteBtn = document.getElementById('getQuoteBtn');
const categorySelect = document.getElementById('category');
const loadingEl = document.getElementById('loading');

// Function to fetch a quote from the API
async function fetchQuote(category = '') {
    // Show loading indicator
    loadingEl.style.display = 'block';
    quoteTextEl.textContent = 'Fetching quote...';
    quoteAuthorEl.textContent = '— Please wait';

    try {
        // Build URL with optional category
        let url = `https://${RAPIDAPI_HOST}/v1/quotes`;
        if (category) {
            url += `?category=${category}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle different response formats
        let quote, author;
        
        if (Array.isArray(data) && data.length > 0) {
            // API returns array of quotes
            quote = data[0].quote;
            author = data[0].author || 'Anonymous';
        } else if (data.quote) {
            // Single quote object
            quote = data.quote;
            author = data.author || 'Unknown';
        } else {
            // Fallback if API response structure is different
            quote = data.content || data.text || data.quoteText || 'Quote not available';
            author = data.author || data.by || 'Anonymous';
        }

        // Update the HTML
        quoteTextEl.textContent = `"${quote}"`;
        quoteAuthorEl.textContent = `— ${author}`;

    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteTextEl.textContent = 'Sorry, could not fetch a quote. Please try again.';
        quoteAuthorEl.textContent = '— Error';
    } finally {
        loadingEl.style.display = 'none';
    }
}

// Function to get a random quote (no category)
async function fetchRandomQuote() {
    await fetchQuote('');
}

// Event listener for the button
getQuoteBtn.addEventListener('click', () => {
    const selectedCategory = categorySelect.value;
    fetchQuote(selectedCategory);
});

// Load a random quote when page loads
window.addEventListener('DOMContentLoaded', () => {
    fetchRandomQuote();
});