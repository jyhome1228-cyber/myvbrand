"""Build the static MYV news archive and full article pages from news-posts.json."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VERSION = '20261006-news01'
BASE_URL = 'https://jyhome1228-cyber.github.io/myvbrand/'

def esc(value):
    return html.escape(value, quote=True)

def rich(text):
    text = text.replace('\\', '').replace('%5C', '')
    pattern = r'\[([^\]]+)\]\((https?://[^\s)]+)\)|(https?://[^\s<>]+)'
    out, start = [], 0
    for match in re.finditer(pattern, text):
        out.append(esc(text[start:match.start()]))
        url = (match[2] or match[3]).rstrip('.,')
        label = match[1] or url
        out.append(f'<a href="{esc(url)}" target="_blank" rel="noopener noreferrer">{esc(label)}</a>')
        start = match.end()
    out.append(esc(text[start:]))
    return ''.join(out)

def body_html(post):
    headings = {
        '상생 이커머스 플랫폼 ‘마이브이’', '가치 소비를 통해 풍요로운 세상을 꿈꾸다',
        '사칙 연산으로 소개하는 ‘마이브이(MyV)’', '소비자가 수익을 얻는 가치 소비',
        '마이브이에서만 가능한 특별한 만남', '순기능 비즈니스 모델, 상생을 추구하는 마이브이',
        '브이랩스 개요', '브이랩스 소개', '강점', 'profile', '유투브 영상',
    }
    out, image_number = [], 0
    if post.get('intro'):
        out.append(f'<p>{esc(post["intro"])}</p>')
    for paragraph in re.split(r'\n\s*\n', post['body']):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        if re.fullmatch(r'https://nineworksdatabase\S+\.webp', paragraph):
            image_number += 1
            alt = f'{post["title"]} — 자료 이미지 {image_number}'
            out.append(f'<figure><img src="{esc(paragraph)}" alt="{esc(alt)}" loading="lazy" decoding="async" /></figure>')
        elif paragraph in headings:
            label = {'profile': '대표 프로필', '유투브 영상': '관련 영상'}.get(paragraph, paragraph)
            out.append(f'<h2>{esc(label)}</h2>')
        elif 'http://' in paragraph or 'https://' in paragraph:
            out.append(f'<div class="article-links">{rich(paragraph)}</div>')
        elif paragraph == '제품 보러 가기':
            out.append('<h2>제품 살펴보기</h2>')
        elif paragraph.startswith('“') and paragraph.endswith('”'):
            out.append(f'<blockquote><p>{rich(paragraph)}</p></blockquote>')
        else:
            out.append(f'<p>{rich(paragraph)}</p>')
    return '\n'.join(out)

def card_html(post):
    external = post.get('type') == 'external'
    attrs = ' target="_blank" rel="noopener noreferrer"' if external else ''
    if post.get('thumbnail'):
        thumb = f'<div class="news-data-thumb has-image"><img src="{esc(post["thumbnail"])}" alt="" loading="lazy" decoding="async" /></div>'
    else:
        thumb = f'<div class="news-data-thumb news-brand-thumb"><span>{esc(post["category"])}</span><img src="./assets/myv-logo.svg" alt="" /><strong>MYV NEWS</strong></div>'
    excerpt = f'<p class="news-data-excerpt">{esc(post["summary"])}</p>' if post.get('summary') else ''
    return f'''<a class="news-data-card" data-post-id="{esc(post['id'])}" data-category="{esc(post['category'])}" data-date="{post['date']}" href="{esc(post['url'])}"{attrs}>
{thumb}
<div class="news-data-body"><span class="news-data-category">{esc(post['category'])}</span><h3>{esc(post['title'])}</h3>{excerpt}<div class="news-data-meta"><time datetime="{post['date']}">{post['date']}</time><span>{'원문 보기 ↗' if external else '자세히 보기 →'}</span></div></div>
</a>'''

def main():
    posts = json.loads((ROOT / 'news-posts.json').read_text())
    # Python's stable sort keeps the supplied order for equal publication dates.
    posts.sort(key=lambda post: post['date'], reverse=True)
    template = (ROOT / 'news-template.html').read_text()
    before = template.split('<main>')[0]
    after = template.split('</main>')[1]
    before = before.replace('</head>', f'<link rel="stylesheet" href="./news.css?v={VERSION}" />\n</head>')
    after = after.replace('./script.js', f'./script.js?v={VERSION}')
    filters = '\n'.join(f'<button type="button" data-filter="{cat}" aria-pressed="{str(cat == "ALL").lower()}" class="{"is-active" if cat == "ALL" else ""}">{cat}</button>' for cat in ['ALL','MYV','PARTNER','GLOBAL'])
    archive = f'''<main>
<section class="page-hero page-hero-navy compact-hero"><div class="container page-hero-inner reveal"><p class="eyebrow light">NEWS</p><h1>MYV NEWS</h1><p>마이브이의 새로운 소식과 파트너십, 글로벌 활동을 전합니다.</p></div></section>
<section class="section news-archive-section" data-news-archive><div class="container">
<div class="news-toolbar reveal"><div class="news-filter" aria-label="뉴스 카테고리">{filters}</div><p id="newsResults" role="status" aria-live="polite" tabindex="-1">전체 {len(posts)}건 · 최신순</p></div>
<div class="news-data-grid reveal">{''.join(card_html(post) for post in posts)}</div>
<nav class="news-pagination" aria-label="뉴스 페이지"></nav>
</div></section></main>'''
    (ROOT / 'news.html').write_text(before + archive + after.replace('</body>', f'<script src="./news-archive.js?v={VERSION}"></script>\n</body>'))
    (ROOT / 'news').mkdir(exist_ok=True)
    for post in posts:
        if post.get('type') == 'external':
            continue
        relative_path = post['url'].removeprefix('./')
        article_before = before.replace('./', '../').replace('class="subpage"', 'class="subpage news-article-page"')
        article_before = article_before.replace('<title>NEWS | MYV</title>', f'<title>{esc(post["title"])} | MYV NEWS</title>')
        article_before = re.sub(r'<meta name="description"[^>]*>', f'<meta name="description" content="{esc(post["summary"])}" />', article_before)
        canonical = BASE_URL + relative_path
        article_before = article_before.replace('</head>', f'''<link rel="canonical" href="{esc(canonical)}" />
<meta property="og:type" content="article" /><meta property="og:title" content="{esc(post['title'])}" /><meta property="og:description" content="{esc(post['summary'])}" /><meta property="og:url" content="{esc(canonical)}" /><meta property="og:image" content="{esc(post['thumbnail'])}" />
</head>''')
        meta = f'<span>게시일 <time datetime="{post["date"]}">{post["date"]}</time></span>'
        if post.get('reportedDate'):
            meta += f'<span>원문 보도일 <time datetime="{post["reportedDate"]}">{post["reportedDate"]}</time></span>'
        notice = '<aside class="article-notice">이 글은 당시 소식을 담은 기록입니다. 서비스 조건과 이벤트 내용은 게재 당시 기준이며, 현재 운영 내용과 다를 수 있습니다.</aside>' if post.get('historical') else ''
        article = f'''<main><article class="article-shell">
<a class="article-back" href="../news.html?category={post['category']}">← 뉴스 목록</a>
<header class="article-heading"><span class="article-category">{post['category']}</span><h1>{esc(post['title'])}</h1><div class="article-meta">{meta}</div></header>
<p class="article-lead">{esc(post['summary'])}</p>{notice}
<div class="article-content">{body_html(post)}</div>
<div class="article-bottom"><a href="../news.html?category={post['category']}">뉴스 목록으로</a></div>
</article></main>'''
        (ROOT / relative_path).write_text(article_before + article + after.replace('./', '../'))
    print(f'Built {len(posts)} cards and {sum(post.get("type") != "external" for post in posts)} article pages.')

if __name__ == '__main__':
    main()
