// Simulate the local quotes array
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" }
  ];
  
  // API Endpoint for simulation (using JSONPlaceholder for mock data)
  const serverUrl = 'https://jsonplaceholder.typicode.com/posts';
  
  // Load quotes from local storage or server if no local data is found
  function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
    } else {
      fetchQuotesFromServer();
    }
    populateCategories();  // Populate categories on page load
    const savedCategory = localStorage.getItem('lastSelectedCategory');
    if (savedCategory) {
      document.getElementById('categoryFilter').value = savedCategory;
    }
    filterQuotes();  // Filter quotes based on the last selected category
  }
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to fetch quotes from the mock server
  function fetchQuotesFromServer() {
    fetch(serverUrl)
      .then(response => response.json())
      .then(data => {
        // Simulate server returning quotes (in a real scenario, you'd get the actual quotes data)
        console.log('Server data fetched:', data);
        // Mock the server response to simulate new quotes
        const serverQuotes = [
          { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Self-Expression" },
          { text: "You only live once, but if you do it right, once is enough.", category: "Life" }
        ];
  
        // Sync with local data: apply conflict resolution
        resolveConflicts(serverQuotes);
  
        // Update the local storage after syncing
        saveQuotes();
        populateCategories();
        filterQuotes();
      })
      .catch(err => console.error('Error fetching data from server:', err));
  }
  
  // Conflict resolution logic: server data takes precedence
  function resolveConflicts(serverQuotes) {
    // Simulate conflict resolution: in this case, the server data takes precedence
    const localTextSet = new Set(quotes.map(q => q.text));
  
    serverQuotes.forEach(serverQuote => {
      if (!localTextSet.has(serverQuote.text)) {
        quotes.push(serverQuote);  // Add new quotes from the server that are not in local storage
      }
    });
  
    alert('Data has been synchronized with the server. Conflicts resolved (server data took precedence).');
  }
  
  // Populate the category dropdown dynamically
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set();
  
    quotes.forEach(quote => {
      categories.add(quote.category);
    });
  
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Function to filter quotes based on selected category
  function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quoteText = document.createElement('p');
      quoteText.textContent = `"${filteredQuotes[randomIndex].text}"`;
  
      const quoteCategory = document.createElement('small');
      quoteCategory.textContent = `- Category: ${filteredQuotes[randomIndex].category}`;
  
      quoteDisplay.innerHTML = '';
      quoteDisplay.appendChild(quoteText);
      quoteDisplay.appendChild(quoteCategory);
    } else {
      quoteDisplay.innerHTML = 'No quotes available in this category.';
    }
  
    localStorage.setItem('lastSelectedCategory', selectedCategory);
  }
  
  // Function to add a new quote
  function addQuote(quoteText, quoteCategory) {
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quote added successfully!');
    } else {
      alert('Please enter both the quote and the category.');
    }
  }
  
  // Function to periodically sync data with the server
  function syncWithServer() {
    setInterval(fetchQuotesFromServer, 60000);  // Sync every 60 seconds (60000ms)
  }
  
  // Function to export quotes to JSON
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes = importedQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Initial setup
  loadQuotes();
  syncWithServer();  // Start syncing with the server periodically
  
  // Add event listeners
  document.getElementById('newQuote').addEventListener('click', () => {
    displayRandomQuote();
  });
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
  
  // Handle exporting and importing
  document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  
  // Function to display a random quote
  function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
  
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${quotes[randomIndex].text}"`;
  
    const quoteCategory = document.createElement('small');
    quoteCategory.textContent = `- Category: ${quotes[randomIndex].category}`;
  
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  }
  