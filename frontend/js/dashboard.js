// Dashboard page script

// Backend base URL
var BASE_URL = "http://localhost:8080";

// Sidebar navigation elements
var navDashboard = document.getElementById('nav-dashboard');
var navApplications = document.getElementById('nav-applications');
var navJobSearch = document.getElementById('nav-job-search');
var navCvReview = document.getElementById('nav-cv-review');
var navEssayReview = document.getElementById('nav-essay-review');

// Section references
var dashboardSection = document.getElementById('dashboard-section');
var cvReviewSection = document.getElementById('cv-review-section');
var essayReviewSection = document.getElementById('essay-review-section');
var jobSearchSection = document.getElementById('job-search-section');

// Array of all nav items for managing active state
var navItems = [navDashboard, navApplications, navJobSearch, navCvReview, navEssayReview];

// Function to show only the selected section and hide others
function showSection(sectionId) {
  dashboardSection.style.display = 'none';
  cvReviewSection.style.display = 'none';
  essayReviewSection.style.display = 'none';
  jobSearchSection.style.display = 'none';

  if (sectionId === 'dashboard') {
    dashboardSection.style.display = '';
  } else if (sectionId === 'cvReview') {
    cvReviewSection.style.display = 'block';
  } else if (sectionId === 'essayReview') {
    essayReviewSection.style.display = 'block';
  } else if (sectionId === 'jobSearch') {
    jobSearchSection.style.display = 'block';
  }
}

// Function to set the 'active' class on the clicked nav item and remove from others
function setActiveNav(clickedNav) {
  navItems.forEach(function(item) {
    if (item) {
      item.classList.remove('active');
    }
  });
  if (clickedNav) {
    clickedNav.classList.add('active');
  }
}

// Attach click event listeners for sidebar navigation items
if (navDashboard) {
  navDashboard.addEventListener('click', function() {
    setActiveNav(navDashboard);
    showSection('dashboard');
  });
}

if (navCvReview) {
  navCvReview.addEventListener('click', function() {
    setActiveNav(navCvReview);
    showSection('cvReview');
  });
}

if (navEssayReview) {
  navEssayReview.addEventListener('click', function() {
    setActiveNav(navEssayReview);
    showSection('essayReview');
  });
}

if (navJobSearch) {
  navJobSearch.addEventListener('click', function() {
    setActiveNav(navJobSearch);
    showSection('jobSearch');
  });
}

// Initially show the dashboard section
showSection('dashboard');

// --- Job Search: Filter and sorting logic ---

// Function to sort jobs based on the created_at date in ascending or descending order
function sortJobs(jobs, sortOrder) {
  if (sortOrder === 'date_desc') {
    return jobs.sort(function(a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  } else if (sortOrder === 'date_asc') {
    return jobs.sort(function(a, b) {
      return new Date(a.created_at) - new Date(b.created_at);
    });
  } else {
    return jobs;
  }
}

// Function to filter jobs based on keyword (title or company) and location matching
function filterJobs(jobs, keyword, location) {
  keyword = keyword.toLowerCase();
  location = location.toLowerCase();

  return jobs.filter(function(job) {
    var title = (job.title || '').toLowerCase();
    var company = (job.company_name || '').toLowerCase();
    var jobLocation = (job.location || '').toLowerCase();

    var keywordMatch = keyword === '' || title.indexOf(keyword) !== -1 || company.indexOf(keyword) !== -1;
    var locationMatch = location === '' || jobLocation.indexOf(location) !== -1;

    return keywordMatch && locationMatch;
  });
}

// Function to render job listings inside the given container element
function renderJobs(jobs, container) {
  if (jobs.length === 0) {
    container.innerHTML = '<p>No jobs match your criteria.</p>';
    return;
  }

  var html = jobs.map(function(job) {
    return (
      '<div style="border-bottom: 1px solid #ddd; padding: 10px 0;">' +
        '<strong>' + (job.title || 'No Title') + '</strong><br/>' +
        (job.company_name || 'Unknown Company') + ' — ' + (job.location || 'Location Unknown') + '<br/>' +
        '<small>Posted on: ' + (new Date(job.created_at).toLocaleDateString() || 'N/A') + '</small><br/>' +
        '<a href="' + job.url + '" target="_blank" rel="noopener noreferrer">View Details</a>' +
      '</div>'
    );
  }).join('');

  container.innerHTML = html;
}

// Asynchronous function to fetch jobs from backend, filter, sort, and display them
function searchJobs() {
  var keywordInput = document.getElementById('filter-keyword');
  var locationInput = document.getElementById('filter-location');
  var sortSelect = document.getElementById('sort-order');
  var resultsDiv = document.getElementById('job-search-results');

  if (!keywordInput || !locationInput || !sortSelect || !resultsDiv) {
    alert('Job search elements missing in DOM');
    return;
  }

  var keyword = keywordInput.value.trim();
  var location = locationInput.value.trim();
  var sortOrder = sortSelect.value;

  resultsDiv.innerHTML = '<p>Loading jobs...</p>';

  // Fetch jobs from backend API
  fetch(BASE_URL + '/api/jobs/?limit=50&offset=0')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Server error: ' + response.statusText);
      }
      return response.json();
    })
    .then(function(data) {
      console.log('Fetched raw jobs data:', data);

      var jobsList = [];
      if (Array.isArray(data)) {
        jobsList = data;
      } else if (data.jobs && Array.isArray(data.jobs)) {
        jobsList = data.jobs;
      } else {
        jobsList = Object.values(data);
      }

      console.log('Processed jobsList:', jobsList);

      // Filter and sort jobs before rendering
      var filteredJobs = sortJobs(filterJobs(jobsList, keyword, location), sortOrder);
      console.log('Filtered and sorted jobs:', filteredJobs);

      renderJobs(filteredJobs, resultsDiv);
    })
    .catch(function(error) {
      console.error('Error fetching or processing jobs:', error);
      resultsDiv.innerHTML = '<p style="color: red;">Error loading jobs: ' + error.message + '</p>';
    });
}

// Attach event listener to the job search button to trigger the search
var searchJobsBtn = document.getElementById('search-jobs-btn');
if (searchJobsBtn) {
  searchJobsBtn.addEventListener('click', function() {
    var keywordInputVal = document.getElementById('filter-keyword').value.trim();
    var locationInputVal = document.getElementById('filter-location').value.trim();

    if (keywordInputVal === '' && locationInputVal === '') {
      alert('Please enter a keyword or location to search jobs.');
      return;
    }
    searchJobs();
  });
} else {
  console.warn('Search jobs button (#search-jobs-btn) not found in DOM.');
}

// Dashboard applications filter alert placeholder
var filterBtn = document.querySelector('.filter-btn');
if (filterBtn) {
  filterBtn.addEventListener('click', function() {
    alert('Filter functionality for applications will be implemented later.');
  });
} else {
  console.warn('Filter button (.filter-btn) not found in DOM.');
}

// --- CV Review upload handler ---

var uploadCvBtn = document.getElementById('upload-cv-btn');
if (uploadCvBtn) {
  uploadCvBtn.addEventListener('click', function() {
    var fileInput = document.getElementById('cv-file-input');
    var resultPre = document.getElementById('cv-review-result');

    if (resultPre) {
      resultPre.textContent = '';
    }

    if (!fileInput) {
      alert('CV file input not found.');
      return;
    }
    if (fileInput.files.length === 0) {
      alert('Please select a CV file to upload.');
      return;
    }

    var formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch(BASE_URL + '/api/cv-review', {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Server error: ' + response.statusText);
      }
      return response.json();
    })
    .then(function(result) {
      console.log('CV Review result:', result);
      if (resultPre) {
        resultPre.textContent = JSON.stringify(result, null, 2);
      }
    })
    .catch(function(error) {
      console.error('Error uploading CV:', error);
      if (resultPre) {
        resultPre.textContent = 'Error: ' + error.message;
      }
    });
  });
} else {
  console.warn('Upload CV button (#upload-cv-btn) not found in DOM.');
}

// --- Essay Review Logic ---

var reviewEssayBtn = document.getElementById('review-essay-btn');
if (reviewEssayBtn) {
  reviewEssayBtn.addEventListener('click', function() {
    var textArea = document.getElementById('essay-text');
    var fileInput = document.getElementById('essay-file-input');
    var resultsDiv = document.getElementById('review-results');

    if (!textArea || !fileInput || !resultsDiv) {
      alert('Essay review elements missing.');
      return;
    }

    resultsDiv.innerHTML = '';

    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      if (file.type !== 'text/plain') {
        alert('Please upload a valid .txt file for the essay.');
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        analyzeEssay(e.target.result, resultsDiv);
      };
      reader.readAsText(file);
    } else if (textArea.value.trim().length > 0) {
      analyzeEssay(textArea.value.trim(), resultsDiv);
    } else {
      alert('Please paste your essay text or upload a .txt file.');
    }
  });
} else {
  console.warn('Essay review button (#review-essay-btn) not found in DOM.');
}

// Function to analyze essay text, provide basic statistics and call backend grammar check
function analyzeEssay(text, resultsDiv) {
  // Calculate word count by matching word boundaries
  var wordCount = (text.match(/\b\w+\b/g) || []).length;

  // Calculate sentence count by splitting on punctuation and filtering out empty strings
  var sentences = text.split(/[.!?]+/).filter(function(s) {
    return s.trim().length > 0;
  });
  var sentenceCount = sentences.length;

  // Detect long sentences (more than 30 words)
  var longSentences = sentences.filter(function(s) {
    var wordsInSentence = s.match(/\b\w+\b/g) || [];
    return wordsInSentence.length > 30;
  });

  // Frequency count of all words (case-insensitive)
  var words = text.toLowerCase().match(/\b\w+\b/g) || [];
  var freq = {};
  words.forEach(function(word) {
    if (!freq[word]) {
      freq[word] = 0;
    }
    freq[word]++;
  });

  // Find words repeated more than 5 times
  var repeatedWords = [];
  for (var word in freq) {
    if (freq[word] > 5) {
      repeatedWords.push(word);
    }
  }

  // Build initial output HTML with statistics
  var output = '<strong>Word count:</strong> ' + wordCount + '<br/>';
  output += '<strong>Sentence count:</strong> ' + sentenceCount + '<br/>';
  output += '<strong>Long sentences detected:</strong> ' + (longSentences.length > 0 ? longSentences.length : 'None') + '<br/>';
  output += '<strong>Frequently repeated words:</strong> ' + (repeatedWords.length > 0 ? repeatedWords.join(', ') : 'None') + '<br/>';

  resultsDiv.innerHTML = output + '<hr/><em>Checking grammar via backend...</em>';

  // Call backend API for grammar check
  fetch(BASE_URL + '/api/grammar-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Grammar check failed: ' + response.statusText);
    }
    return response.json();
  })
  .then(function(grammarResult) {
    console.log('Grammar check result:', grammarResult);
    if (grammarResult.matches && grammarResult.matches.length > 0) {
      var issuesHtml = grammarResult.matches.map(function(match) {
        return '<li><strong>' + match.message + '</strong> — Offset: ' + match.offset + ', Length: ' + match.length +
          ', Context: "' + text.substr(match.offset, match.length) + '"</li>';
      }).join('');

      resultsDiv.innerHTML += '<h4>Grammar Suggestions:</h4><ul>' + issuesHtml + '</ul>';
    } else {
      resultsDiv.innerHTML += '<h4>Grammar Suggestions:</h4><p>No issues found!</p>';
    }
  })
  .catch(function(error) {
    console.error('Error during grammar check:', error);
    resultsDiv.innerHTML += '<p style="color:red;">Error checking grammar: ' + error.message + '</p>';
  });
}

