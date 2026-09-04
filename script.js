document.addEventListener('DOMContentLoaded', () => {

    // 1. スクロールプログレスバー
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // 2. ローディング画面の制御
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => { loader.classList.add('loaded'); }, 600);
        });
        setTimeout(() => { loader.classList.add('loaded'); }, 2000);
    }

    // 3. ハンバーガーメニュー
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = navLinks ? navLinks.querySelectorAll('a') : [];

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 4. スクロールに応じたヘッダーの変化
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 5. 高度なスクロール連動フェードイン
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // 6. 実績カウンターの数字滑らかカウントアップ演出
    const statNums = document.querySelectorAll('.stat-num');
    let hasCounted = false;

    const countUp = () => {
        statNums.forEach(numEl => {
            const target = +numEl.getAttribute('data-target');
            let current = 0;
            const duration = 2000;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    numEl.innerText = Math.floor(current);
                    setTimeout(updateCount, stepTime);
                } else {
                    numEl.innerText = target;
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.stats-section');
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                countUp();
                hasCounted = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 7. こだわりセクションの滑らかなタブ切り替え
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    setTimeout(() => {
                        targetPanel.classList.add('active');
                    }, 150);
                }
            });
        });
    }

    // 8. 施工事例のカテゴリーフィルター機能
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => item.classList.remove('hide'), 50);
                    } else {
                        item.classList.add('hide');
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // 9. ライトボックス
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    if (modal && modalImg && closeBtn) {
        triggers.forEach(img => {
            img.addEventListener('click', () => {
                modal.classList.add('active');
                modalImg.src = img.src;
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // 10. ページトップへ戻るボタンの制御
    const pageTop = document.getElementById('pageTop');
    if (pageTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                pageTop.classList.add('active');
            } else {
                pageTop.classList.remove('active');
            }
        });

        pageTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 11. お問い合わせフォームのリアルタイムバリデーション＆送信エフェクト
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();

            if (name === '' || email === '') {
                alert('必須項目（お名前・メールアドレス）が入力されていません。');
                return;
            }

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = '送信中...';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                alert('【送信完了】\nお問い合わせありがとうございます。担当者より折り返しご連絡いたします。');
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.style.opacity = '1';
            }, 1000);
        });
    }

});
