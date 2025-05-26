// script.js（画像表示対応版）

let allowance = 0;
let currentArea = '';
let cart = [];

const items = {
    'お菓子': [
        { name: 'チョコ', price: 100, image: 'choco.png' },
        { name: 'グミ', price: 80, image: 'gummy.png' },
        { name: 'ポテチ', price: 120, image: 'potato.png' },
        { name: 'ビスケット', price: 90, image: 'biscuit.png' },
        { name: 'あめ玉', price: 30, image: 'candy.png' },
        { name: 'プリン', price: 110, image: 'pudding.png' },
        { name: 'ゼリー', price: 70, image: 'jelly.png' },
        { name: 'ポップコーン', price: 160, image: 'popcorn.png' }
    ],
    'おもちゃ': [
        { name: 'ミニカー', price: 300, image: 'car.png' },
        { name: 'パズル', price: 400, image: 'puzzle.png' },
        { name: 'ブロック', price: 350, image: 'block.png' },
        { name: 'ボール', price: 200, image: 'ball.png' },
        { name: 'ロボット', price: 450, image: 'robot.png' },
        { name: 'なわとび', price: 300, image: 'jump_rope.png' },
        { name: '指人形', price: 180, image: 'puppet.png' },
        { name: '太鼓', price: 400, image: 'drum.png' }
    ],
    '飲み物': [
        { name: 'お茶', price: 100, image: 'tea.png' },
        { name: 'オレンジジュース', price: 150, image: 'juice.png' },
        { name: 'ミルク', price: 120, image: 'milk.png' },
        { name: 'サイダー', price: 100, image: 'cider.png' },
        { name: 'コーラ', price: 140, image: 'cola.png' },
        { name: '100%オレンジジュース', price: 130, image: 'orange_juice.png' },
        { name: 'スポーツドリンク', price: 150, image: 'sports_drink.png' },
        { name: '野菜ジュース', price: 160, image: 'vegetable_juice.png' }
    ],
    '本': [
        { name: '絵本', price: 500, image: 'picturebook.png' },
        { name: '図鑑', price: 700, image: 'encyclopedia.png' },
        { name: 'まんが本', price: 350, image: 'manga.png' },
        { name: '図工ブック', price: 400, image: 'artbook.png' }
    ]
};

function goToAreaSelection() {
    allowance = parseInt(document.getElementById('allowance').value);
    if (isNaN(allowance) || allowance <= 0) {
        alert('お小遣いを入力してください');
        return;
    }
    switchScreen('screen-allowance', 'screen-area');
    renderCartPreview();
    document.getElementById('allowance-display').textContent = `💰 お小遣い：${allowance}円`;
}

function selectArea(area) {
    currentArea = area;
    document.getElementById('area-title').textContent = area + 'コーナー';
    const list = document.getElementById('item-list');
    list.innerHTML = '';

    items[area].forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
      <img src="images/${item.image}" alt="${item.name}">
      <p>${item.name} - ${item.price}円</p>
      <button onclick="addToCart('${area}', ${index})">かごに入れる</button>
    `;
        list.appendChild(div);
    });

    switchScreen('screen-area', 'screen-items');
}

function addToCart(area, index) {
    cart.push(items[area][index]);
    alert(items[area][index].name + ' を追加しました');
    renderCartPreview();
}

function backToArea() {
    switchScreen('screen-items', 'screen-area');
}

function backToAreaFromCheckout() {
    switchScreen('screen-checkout', 'screen-area');
    renderCartPreview();
}

function goToCheckout() {
    switchScreen('screen-area', 'screen-checkout');
    renderCart();
    setupMoneyOptions();
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.textContent = `${item.name} - ${item.price}円`;

        const btn = document.createElement('button');
        btn.textContent = '削除';
        btn.onclick = () => {
            cart.splice(index, 1);
            renderCart();
        };

        div.appendChild(btn);
        cartList.appendChild(div);
    });

    document.getElementById('total-price').textContent = '';
}

function renderCartPreview() {
    const preview = document.getElementById('cart-preview');
    preview.innerHTML = '';

    if (cart.length === 0) {
        preview.textContent = 'かごは空です';
        return;
    }

    cart.forEach(item => {
        const p = document.createElement('p');
        p.textContent = `${item.name} - ${item.price}円`;
        preview.appendChild(p);
    });
}


function checkUserTotal() {
    const correctTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const userInput = parseInt(document.getElementById('user-total').value);
    const feedback = document.getElementById('total-feedback');

    if (isNaN(userInput)) {
        feedback.textContent = '数字を入力してください';
        feedback.style.color = 'gray';
        return;
    }

    if (userInput === correctTotal) {
        if (correctTotal > allowance) {
            feedback.textContent = `正解ですが、合計は ${correctTotal} 円でお小遣い（${allowance}円）を超えています。`;
            feedback.style.color = 'red';
        } else {
            feedback.textContent = `正解です！合計は ${correctTotal} 円でした🎉`;
            feedback.style.color = 'green';
            document.getElementById('total-price').textContent = `合計：${correctTotal}円`;
        }
    } else {
        feedback.textContent = 'ちがいます。もう一度考えてみよう。';
        feedback.style.color = 'red';
    }
}

function setupMoneyOptions() {
    const moneyOptions = [1, 5, 10, 50, 100, 500, 1000];
    const container = document.getElementById('money-options');
    container.innerHTML = '';
    moneyOptions.forEach(val => {
        const btn = document.createElement('button');
        btn.textContent = `${val}円`;
        btn.onclick = () => addMoney(val);
        container.appendChild(btn);
    });
    paidAmount = 0;
    document.getElementById('paid-amount').textContent = '支払額：0円';
    document.getElementById('change').textContent = '';
}

let paidAmount = 0;
function addMoney(amount) {
    paidAmount += amount;
    document.getElementById('paid-amount').textContent = `支払額：${paidAmount}円`;
}

function resetPayment() {
    paidAmount = 0;
    document.getElementById('paid-amount').textContent = '支払額：0円';
    document.getElementById('change').textContent = '';
}

function completePayment() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (total > allowance) {
        alert(`お小遣いの ${allowance}円 を超えています！買いすぎです！`);
        return;
    }

    if (paidAmount > allowance) {
        alert(`支払額が ${paidAmount}円 ですが、お小遣いは ${allowance}円 までです！`);
        return;
    }

    if (paidAmount < total) {
        alert('お金が足りません');
        return;
    }

    const change = paidAmount - total;
    document.getElementById('change').textContent = `お釣り：${change}円`;
    document.getElementById('payment-feedback').textContent = 'お支払いが完了しました！🎉';
    document.getElementById('payment-feedback').style.color = 'green';
}

function resetApp() {
    allowance = 0;
    currentArea = '';
    cart = [];
    paidAmount = 0;

    ['screen-allowance', 'screen-area', 'screen-items', 'screen-checkout'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    document.getElementById('screen-allowance').style.display = 'block';

    document.getElementById('allowance').value = '';
    document.getElementById('cart-list').innerHTML = '';
    document.getElementById('total-price').textContent = '';
    document.getElementById('paid-amount').textContent = '';
    document.getElementById('change').textContent = '';
    document.getElementById('money-options').innerHTML = '';
    document.getElementById('user-total').value = '';
    document.getElementById('total-feedback').textContent = '';
    document.getElementById('allowance-display').textContent = '';
    document.getElementById('payment-feedback').textContent = '';

}

function switchScreen(from, to) {
    document.getElementById(from).style.display = 'none';
    document.getElementById(to).style.display = 'block';
}
