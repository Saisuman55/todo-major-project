const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    console.log('Navigating to http://localhost:5000...');
    
    // Clear out any local storage simply by navigating and executing
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    console.log('Taking login screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'screenshots', '1-login.png') });

    // Login
    console.log('Logging in...');
    const emailInput = await page.$('input[placeholder="Email"]');
    if (!emailInput) throw new Error('Could not find email input');
    
    await emailInput.type('reviewer@example.com');
    await page.type('input[placeholder="Password"]', 'Password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(e => console.log('Navigation wait timeout or ignored.'));
    await new Promise(r => setTimeout(r, 1000)); // give react a second to render
    
    console.log('Taking dashboard screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'screenshots', '2-dashboard.png') });

    // Focus on date picker to show the popup
    console.log('Opening datepicker...');
    const dateInput = await page.$('.react-datepicker__input-container input');
    if (dateInput) {
       await dateInput.click();
       await new Promise(r => setTimeout(r, 500)); // wait for popup animation
       console.log('Taking datepicker popup screenshot...');
       await page.screenshot({ path: path.join(__dirname, 'screenshots', '3-datepicker.png') });
    } else {
       console.log('DatePicker not found on the page.');
    }

    // Close DatePicker
    await page.mouse.click(10, 10);
    await new Promise(r => setTimeout(r, 600));

    // Edit a task
    console.log('Clicking Edit Task...');
    const editBtn = await page.$('button[title="Edit"]');
    if (editBtn) {
       await editBtn.click();
       await new Promise(r => setTimeout(r, 600));
       console.log('Taking edit task screenshot...');
       await page.screenshot({ path: path.join(__dirname, 'screenshots', '4-edit-task.png') });
       
       // Cancel edit
       const cancelBtn = await page.evaluateHandle(() => {
         const btns = Array.from(document.querySelectorAll('button'));
         return btns.find(b => b.textContent === 'Cancel');
       });
       if (cancelBtn) {
         await cancelBtn.click();
         await new Promise(r => setTimeout(r, 600));
       }
    }

    // Search Filter
    console.log('Typing in Search Filter...');
    const searchInput = await page.$('.search-input');
    if (searchInput) {
       await searchInput.type('a'); // Type something generic to filter or just show active search
       await new Promise(r => setTimeout(r, 600));
       console.log('Taking search task screenshot...');
       await page.screenshot({ path: path.join(__dirname, 'screenshots', '5-search-filter.png') });
    }

    console.log('Screenshots completed successfully!');
    await browser.close();
  } catch (error) {
    console.error('Error during screenshot capture:', error);
    process.exit(1);
  }
})();
