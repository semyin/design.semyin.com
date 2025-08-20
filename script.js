// 主题切换功能
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
        this.initBackToTop();
        this.initSearchModal();
    }

    bindEvents() {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });

        // 桌面端搜索功能
        const searchInputs = document.querySelectorAll('.search-input');
        const searchButtons = document.querySelectorAll('.search-btn');

        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(input.value);
                }
            });

            input.addEventListener('input', (e) => {
                if (e.target.value === '') {
                    this.clearSearch();
                }
            });
        });

        searchButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.parentElement.querySelector('.search-input');
                this.performSearch(input.value);
            });
        });

        // 移动端搜索切换按钮
        const searchToggles = document.querySelectorAll('.search-toggle');
        searchToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.openSearchModal());
        });
    }

    // 返回顶部功能
    initBackToTop() {
        const backToTopButton = document.querySelector('.back-to-top');
        if (!backToTopButton) return;

        // 监听滚动事件
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // 点击返回顶部
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 搜索历史管理
    getSearchHistory() {
        try {
            const history = localStorage.getItem('searchHistory');
            return history ? JSON.parse(history) : [];
        } catch (e) {
            return [];
        }
    }

    addToSearchHistory(query) {
        if (!query.trim()) return;
        
        let history = this.getSearchHistory();
        
        // 如果已存在，先移除
        history = history.filter(item => item.query !== query.trim());
        
        // 添加到开头
        history.unshift({
            query: query.trim(),
            timestamp: Date.now()
        });
        
        // 保持最多10个记录
        history = history.slice(0, 10);
        
        try {
            localStorage.setItem('searchHistory', JSON.stringify(history));
        } catch (e) {
            console.error('保存搜索历史失败:', e);
        }
        
        // 更新历史记录显示
        this.updateSearchHistoryDisplay();
    }

    clearSearchHistory() {
        try {
            localStorage.removeItem('searchHistory');
            this.updateSearchHistoryDisplay();
        } catch (e) {
            console.error('清除搜索历史失败:', e);
        }
    }

    updateSearchHistoryDisplay() {
        const historyContent = document.querySelector('.search-history-content');
        const historySection = document.querySelector('.search-history');
        
        if (!historyContent || !historySection) return;
        
        const history = this.getSearchHistory();
        
        if (history.length === 0) {
            historySection.style.display = 'none';
            return;
        }
        
        historySection.style.display = 'block';
        historyContent.innerHTML = history.map(item => `
            <span class="search-history-item" data-query="${item.query}">
                ${item.query}
                <button class="search-history-delete" data-query="${item.query}">×</button>
            </span>
        `).join('');
        
        // 添加点击事件
        historyContent.querySelectorAll('.search-history-item').forEach(item => {
            const query = item.dataset.query;
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('search-history-delete')) {
                    e.stopPropagation();
                    this.removeFromSearchHistory(query);
                } else {
                    this.searchFromHistory(query);
                }
            });
        });
    }

    removeFromSearchHistory(query) {
        let history = this.getSearchHistory();
        history = history.filter(item => item.query !== query);
        
        try {
            localStorage.setItem('searchHistory', JSON.stringify(history));
            this.updateSearchHistoryDisplay();
        } catch (e) {
            console.error('删除搜索历史失败:', e);
        }
    }

    searchFromHistory(query) {
        const searchModalInput = document.querySelector('.search-modal-input');
        if (searchModalInput) {
            searchModalInput.value = query;
            this.performModalSearch(query);
            this.addToSearchHistory(query);
        }
    }

    // 搜索弹出层功能
    initSearchModal() {
        const searchOverlay = document.querySelector('.search-overlay');
        const searchModalInput = document.querySelector('.search-modal-input');
        const searchClose = document.querySelector('.search-close');

        if (!searchOverlay) return;

        // 关闭搜索弹出层
        searchClose?.addEventListener('click', () => this.closeSearchModal());

        // 点击背景关闭
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                this.closeSearchModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                this.closeSearchModal();
            }
        });

        // 搜索输入
        searchModalInput?.addEventListener('input', (e) => {
            if (e.target.value.trim()) {
                this.performModalSearch(e.target.value);
            } else {
                this.clearModalSearch();
            }
        });

        // 清除历史记录按钮
        const searchHistoryClear = document.querySelector('.search-history-clear');
        searchHistoryClear?.addEventListener('click', () => this.clearSearchHistory());

        searchModalInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                const query = e.target.value.trim();
                this.addToSearchHistory(query);
                this.performModalSearch(query);
            }
        });
    }

    openSearchModal() {
        const searchOverlay = document.querySelector('.search-overlay');
        const searchModalInput = document.querySelector('.search-modal-input');
        
        if (searchOverlay) {
            // 获取滚动条宽度
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            // 添加右侧padding补偿滚动条宽度，防止页面抖动
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            
            // 显示搜索历史
            this.updateSearchHistoryDisplay();
            
            // 聚焦搜索框
            setTimeout(() => {
                searchModalInput?.focus();
            }, 100);
        }
    }

    closeSearchModal() {
        const searchOverlay = document.querySelector('.search-overlay');
        const searchModalInput = document.querySelector('.search-modal-input');
        
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // 恢复padding
            document.body.style.paddingRight = '';
            
            // 清空搜索
            if (searchModalInput) {
                searchModalInput.value = '';
            }
            this.clearModalSearch();
        }
    }

    performModalSearch(query) {
        const posts = document.querySelectorAll('.post-item');
        const resultsContent = document.querySelector('.search-results-content');
        
        if (!resultsContent) return;

        let results = [];
        
        posts.forEach(post => {
            const titleElement = post.querySelector('.post-title a');
            const tagsElements = post.querySelectorAll('.tag');
            const dateElement = post.querySelector('.post-date');
            
            if (!titleElement) return;
            
            const title = titleElement.textContent.toLowerCase();
            const tags = Array.from(tagsElements).map(tag => tag.textContent.toLowerCase());
            const date = dateElement ? dateElement.textContent : '';
            const href = titleElement.getAttribute('href');

            const matchesTitle = title.includes(query.toLowerCase());
            const matchesTags = tags.some(tag => tag.includes(query.toLowerCase()));

            if (matchesTitle || matchesTags) {
                results.push({
                    title: titleElement.textContent,
                    date: date,
                    tags: Array.from(tagsElements).map(tag => tag.textContent),
                    href: href
                });
            }
        });

        this.displayModalResults(results, query);
    }

    displayModalResults(results, query) {
        const resultsContent = document.querySelector('.search-results-content');
        
        if (!resultsContent) return;

        if (results.length === 0) {
            resultsContent.innerHTML = `
                <div class="search-no-results">
                    未找到匹配 "${query}" 的文章
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => {
            const highlightedTitle = result.title.replace(
                new RegExp(`(${query})`, 'gi'),
                '<mark style="background: var(--accent-color); color: white; padding: 0.1rem 0.2rem; border-radius: 3px;">$1</mark>'
            );

            const tagsHTML = result.tags.map(tag => {
                const highlightedTag = tag.includes(query.toLowerCase()) 
                    ? `<span class="tag" style="background: var(--accent-color); color: white;">${tag}</span>`
                    : `<span class="tag">${tag}</span>`;
                return highlightedTag;
            }).join(' ');

            return `
                <div class="search-result-item" onclick="window.location.href='${result.href}'">
                    <div class="search-result-title">${highlightedTitle}</div>
                    <div class="search-result-meta">
                        <span>${result.date}</span>
                        <span>${tagsHTML}</span>
                    </div>
                </div>
            `;
        }).join('');

        resultsContent.innerHTML = resultsHTML;
    }

    clearModalSearch() {
        const resultsContent = document.querySelector('.search-results-content');
        if (resultsContent) {
            resultsContent.innerHTML = '';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // 移除手动设置innerHTML，让CSS伪元素处理图标显示
    }

    performSearch(query) {
        if (!query.trim()) return;

        const posts = document.querySelectorAll('.post-item');
        let hasResults = false;

        posts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const tags = Array.from(post.querySelectorAll('.tag'))
                .map(tag => tag.textContent.toLowerCase());

            const matchesTitle = title.includes(query.toLowerCase());
            const matchesTags = tags.some(tag => tag.includes(query.toLowerCase()));

            if (matchesTitle || matchesTags) {
                post.style.display = 'block';
                this.highlightSearchTerm(post, query);
                hasResults = true;
            } else {
                post.style.display = 'none';
            }
        });

        // 显示搜索结果状态
        this.showSearchStatus(query, hasResults);
    }

    highlightSearchTerm(post, query) {
        const title = post.querySelector('.post-link');
        const originalText = title.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        title.innerHTML = originalText.replace(regex, '<mark style="background: var(--accent-color); color: white; padding: 0.1rem 0.2rem; border-radius: 3px;">$1</mark>');
    }

    clearSearch() {
        const posts = document.querySelectorAll('.post-item');
        posts.forEach(post => {
            post.style.display = 'block';
            const title = post.querySelector('.post-link');
            title.innerHTML = title.textContent; // 移除高亮
        });
        this.removeSearchStatus();
    }

    showSearchStatus(query, hasResults) {
        this.removeSearchStatus();
        
        const postsContainer = document.querySelector('.posts');
        const statusDiv = document.createElement('div');
        statusDiv.className = 'search-status';
        statusDiv.innerHTML = hasResults 
            ? `<p style="color: var(--text-secondary); font-style: italic; margin-bottom: 2rem;">搜索 "${query}" 的结果</p>`
            : `<p style="color: var(--text-secondary); font-style: italic; margin-bottom: 2rem;">未找到匹配 "${query}" 的文章</p>`;
        
        postsContainer.parentNode.insertBefore(statusDiv, postsContainer);
    }

    removeSearchStatus() {
        const existingStatus = document.querySelector('.search-status');
        if (existingStatus) {
            existingStatus.remove();
        }
    }
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();

    // 添加一些交互效果
    const postItems = document.querySelectorAll('.post-item');
    postItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(4px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });

    // 标签点击搜索功能
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchInputs = document.querySelectorAll('.search-input');
            searchInputs.forEach(input => {
                input.value = tag.textContent;
            });
            
            const themeManager = new ThemeManager();
            themeManager.performSearch(tag.textContent);
        });
    });
});

// 防抖函数，优化搜索性能
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}