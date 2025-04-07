document.addEventListener('DOMContentLoaded', function() {
  const processBtn = document.getElementById('processBtn');
  const idsInput = document.getElementById('idsInput');
  const resultsBody = document.getElementById('resultsBody');
  const notFoundList = document.getElementById('notFoundList');
  const foundCount = document.getElementById('foundCount');
  const notFoundCount = document.getElementById('notFoundCount');
  const tabBtns = document.querySelectorAll('.tab-btn');

  processBtn.addEventListener('click', async function() {
    const idsText = idsInput.value.trim();
    if (!idsText) {
      alert('الرجاء إدخال الـ IDs للمعالجة');
      return;
    }
    
    const idsArray = idsText.split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0);
    
    if (idsArray.length > 500) {
      alert('الحد الأقصى هو 500 ID في المرة الواحدة');
      return;
    }
    
    processBtn.disabled = true;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
    
    try {
      const response = await fetch('/api/processIDs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: idsArray })
      });
      
      const data = await response.json();
      
      if (data.success) {
        displayResults(data);
      } else {
        throw new Error(data.error || 'حدث خطأ في المعالجة');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      processBtn.disabled = false;
      processBtn.innerHTML = '<i class="fas fa-play"></i> بدء المعالجة';
    }
  });

  function displayResults(data) {
    foundCount.textContent = data.found_count;
    notFoundCount.textContent = data.not_found_count;
    
    resultsBody.innerHTML = '';
    data.data.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.ID || ''}</td>
        <td>${student.Name || ''}</td>
        <td>${student.Course || ''}</td>
        <td>${student.Year || ''}</td>
      `;
      resultsBody.appendChild(row);
    });
    
    notFoundList.innerHTML = '';
    data.not_found_ids.forEach(id => {
      const div = document.createElement('div');
      div.textContent = id;
      notFoundList.appendChild(div);
    });
    
    document.getElementById('found').style.display = 'block';
    document.getElementById('notFound').style.display = 'none';
    tabBtns[0].classList.add('active');
    tabBtns[1].classList.remove('active');
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      document.getElementById(tabId).style.display = 'block';
    });
  });
});