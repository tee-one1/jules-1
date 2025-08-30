document.addEventListener('DOMContentLoaded', () => {
    // Element referansları
    const storyTextInput = document.getElementById('story-text');
    const styleChoices = document.getElementById('style-choices');
    const selectedStyleInput = document.getElementById('selected-style');
    const generateComicBtn = document.getElementById('generate-comic-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const comicDisplaySection = document.getElementById('comic-display-section');
    const comicStrip = document.getElementById('comic-strip');
    const downloadBtn = document.getElementById('download-btn');

    // Diyalog Modalı Elementleri
    const dialogueModal = document.getElementById('dialogue-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const addDialogueBtn = document.getElementById('add-dialogue-btn');
    const dialogueTextInput = document.getElementById('dialogue-text');
    let activePanel = null;

    // --- Aşama 3: Sanat Tarzı Seçimi ---
    styleChoices.addEventListener('click', (e) => {
        const styleOption = e.target.closest('.style-option');
        if (!styleOption) return;

        // Diğer seçimleri kaldır
        document.querySelectorAll('.style-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Seçileni işaretle
        styleOption.classList.add('selected');
        selectedStyleInput.value = styleOption.dataset.style;
    });

    // --- Çizgi Roman Oluşturma Butonu ---
    generateComicBtn.addEventListener('click', () => {
        const story = storyTextInput.value.trim();
        const style = selectedStyleInput.value;

        if (!story) {
            alert('Lütfen bir hikaye yazın.');
            return;
        }
        if (!style) {
            alert('Lütfen bir sanat tarzı seçin.');
            return;
        }

        generateComic(story, style);
    });

    // --- Aşama 2 (Simülasyon) & 4 (Simülasyon): Çizgi Romanı Üretme ---
    async function generateComic(story, style) {
        // Arayüzü hazırla
        loadingIndicator.classList.remove('hidden');
        comicDisplaySection.classList.add('hidden');
        comicStrip.innerHTML = ''; // Eski panelleri temizle

        // Aşama 2: Hikayeyi panellere böl (cümlelere ayırarak simüle et)
        const sentences = story.match(/[^.!?]+[.!?]+/g) || [story];
        const panelPrompts = sentences.slice(0, 10); // En fazla 10 panel

        // Aşama 4: Panelleri üret
        for (const prompt of panelPrompts) {
            const panelElement = await createPanel(prompt, style);
            comicStrip.appendChild(panelElement);
        }

        // Arayüzü güncelle
        loadingIndicator.classList.add('hidden');
        comicDisplaySection.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
    }

    // --- Panel Üretme Fonksiyonu (Simülasyon) ---
    async function createPanel(prompt, style) {
        const panel = document.createElement('div');
        panel.className = 'comic-panel';

        const img = document.createElement('img');

        // Unsplash API kullanarak anahtar kelime ile görsel çekme
        // Not: Bu basit bir anahtar kelime çıkarma yöntemidir.
        const keywords = prompt.split(' ').slice(0, 3).join(',') + ',' + style;
        img.src = `https://source.unsplash.com/400x400/?${encodeURIComponent(keywords)}`;

        const promptOverlay = document.createElement('div');
        promptOverlay.className = 'panel-prompt';
        promptOverlay.textContent = prompt.trim();

        panel.appendChild(img);
        panel.appendChild(promptOverlay);

        // Panele tıklayınca diyalog modalını aç
        panel.addEventListener('click', () => {
            activePanel = panel;
            dialogueModal.classList.remove('hidden');
            dialogueTextInput.focus();
        });

        return panel;
    }

    // --- Aşama 5: Diyalog Ekleme ---

    // Modalı kapatma
    closeModalBtn.addEventListener('click', () => {
        dialogueModal.classList.add('hidden');
    });

    // Diyalog ekleme butonu
    addDialogueBtn.addEventListener('click', () => {
        const text = dialogueTextInput.value.trim();
        if (text && activePanel) {
            addSpeechBubble(activePanel, text);
            dialogueTextInput.value = '';
            dialogueModal.classList.add('hidden');
        }
    });

    function addSpeechBubble(panel, text) {
        const bubble = document.createElement('div');
        bubble.className = 'speech-bubble';
        bubble.textContent = text;

        // Basit konumlandırma
        const existingBubbles = panel.querySelectorAll('.speech-bubble').length;
        bubble.style.top = `${10 + existingBubbles * 25}%`;
        bubble.style.left = '10%';

        panel.appendChild(bubble);
    }

    // --- Final: İndirme Butonu ---
    downloadBtn.addEventListener('click', () => {
        // Butonu geçici olarak gizle ki ekran görüntüsünde çıkmasın
        downloadBtn.classList.add('hidden');

        html2canvas(comicStrip, {
            useCORS: true, // Unsplash gibi harici kaynaklar için gerekli
            logging: true,
            windowWidth: comicStrip.scrollWidth,
            windowHeight: comicStrip.scrollHeight
        }).then(canvas => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'cizgi-roman.png';
            link.click();

            // Butonu geri göster
            downloadBtn.classList.remove('hidden');
        });
    });

});
