from pathlib import Path
from math import cos,sin,pi,sqrt
from html import escape
from tempfile import TemporaryDirectory
from subprocess import run
from textwrap import wrap

plates = {}
p = Path(__file__).resolve().parents[1] / 'apps/showcase/public/foundations'
p.mkdir(parents=True, exist_ok=True)
blue,white,violet,gold,coral='#2639a5','#faf4e8','#504166','#f2d498','#e48378'
def leaf(x,y,size,col,guide=False):
    path='M0 -5 C-16 -14 -18 -35 -8 -43 C-10 -29 7 -27 3 -17 Q10 -23 10 -31 Q18 -17 0 -5Z'
    petals=''.join(f'<path d="{path}" transform="rotate({i*60})"/>' for i in range(6))
    rings=''.join(f'<circle r="{r}"/>' for r in (6,28,44)) if guide else ''
    axes=''.join(f'<path d="M0 0V-48" transform="rotate({i*60})"/>' for i in range(6)) if guide else ''
    return f'<g transform="translate({x} {y}) scale({size/44})" fill="{"none" if guide else col}" stroke="{col}" stroke-width=".8">{petals}<g fill="none" opacity=".45">{rings}{axes}</g></g>'
def court(bg=white,ink=blue,accent=coral,step=44,guide=False,opening=True):
    drawing=f'<rect width="400" height="320" fill="{bg}"/>'
    for row in range(round(264/step)+1):
        y = 28 + row * 264 / round(264/step)
        for col in range(round(352/step)+1):
            x = 24 + col * 352 / round(352/step)
            if 63<x<337 and 68<y<251: continue
            if opening and y>245 and 135<x<265: continue
            drawing+=leaf(x,y,step*.48,ink,guide)
    return drawing+f'<circle cx="200" cy="160" r="3" fill="{accent}"/>'
def svg(name,art):
    (p/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320">{art}</svg>')
def field(guides=False):
    a=25;b=a/sqrt(2);c=a-b
    pts=[(a,0),(b,c),(b,b),(c,b)]
    poly=' '.join(f'{x*cos(i*pi/2)-y*sin(i*pi/2):.3f},{x*sin(i*pi/2)+y*cos(i*pi/2):.3f}' for i in range(4) for x,y in pts)
    return f'<defs><pattern id="tile" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="{white}"/><polygon transform="translate(25 25)" points="{poly}" fill="{white if guides else blue}" stroke="{blue}" stroke-width=".8"/>'+('<path d="M0 0L50 50M50 0L0 50M25 0V50M0 25H50" stroke="#bc8682" stroke-width=".5"/>' if guides else '')+'</pattern></defs><rect width="400" height="320" fill="url(#tile)"/>'
svg('threshold',f'<rect width="400" height="320" fill="{violet}"/>'+''.join(f'<path d="M{x} 320V140Q{x} 68 244 {max(y, 0)}Q{488-x} 68 {488-x} 140V320Z" fill="{color}"/>' for x,y,color in [(75,0,blue),(92,14,gold),(98,20,white)]))
svg('water',f'<rect width="400" height="320" fill="{white}"/>'+''.join(f'<path d="M-10 {30+2*i+i*i} Q90 {2+i*i} 200 {30+2*i+i*i}T410 {30+2*i+i*i}" fill="none" stroke="{blue}" opacity="{1-i/17}" stroke-width="2"/>' for i in range(16)))
for n,art in [('courtyard',court()),('evening',court(violet,gold,coral)),('reverse',court(blue,white,gold)),('rest',court(step=62)),('balance',court(step=40,opening=False)),('construction',court(guide=True)),('field',field()),('grid',field(True)),('bloom',f'<rect width="400" height="320" fill="{white}"/>'+leaf(200,160,135,blue)),('bloom-grid',f'<rect width="400" height="320" fill="{white}"/>'+leaf(200,160,135,blue,True))]:svg(n,art)
def ar(t):return f'<span lang="ar" dir="rtl">{t}</span>'
def plate(n,en,arab,cap,ac):
    plates.setdefault(n, (en, arab, cap, ac))
    return f'<figure><img src="{n}.svg" alt="{escape(cap)}"><figcaption><h3>{en} {ar(arab)}</h3>{cap}{ar(ac)}</figcaption></figure>'
def section(en,arab,items):return f'<section><h2>{en} {ar(arab)}</h2><div class="plates">{items}</div></section>'
def trio(rows):return ''.join(plate(*r) for r in rows)
book=section('The quiet centre','الفناء الهادئ',trio([('courtyard','The courtyard','الفناء','An opening in the lower border invites the eye inward. A single coral point holds the empty space.','فتحة في الحافة السفلى تدعو العين إلى الداخل، ونقطة مرجانية تستقر في قلب الفراغ.'),('construction','How it is drawn','خطوط الإنشاء','Six leaves turn about each centre. The border stops on either side of the entrance.','تدور ستّ ورقات حول كل مركز، وتتوقف الزخرفة على جانبي المدخل.')]))
book+=section('Gardens of light','حدائق النور',trio([('threshold','Threshold','العتبة','A thin gold edge catches the light at the opening.','يلتقط شريط ذهبي رفيع الضوء عند المدخل.'),('courtyard','Courtyard','الفناء','The garden gathers at the edges.','تجتمع أوراق الحديقة عند الأطراف.'),('water','Water','الماء','The ripples grow farther apart as their colour fades.','تتباعد التموجات ويخفت لونها تدريجياً.')]))
book+=section('Principles in a drawing','المبادئ في الرسم',trio([('courtyard','Welcome','الترحيب','Leave a way in.','نترك مدخلاً مفتوحاً.'),('rest','Tranquillity','الطمأنينة','Fewer, larger blooms slow the border’s rhythm.','أزهار أكبر وأقل عدداً تمنح الحافة إيقاعاً أهدأ.'),('balance','Beauty','الجمال','One radius governs every leaf cluster around the enclosure.','يضبط نصف قطر واحد عناقيد الأوراق حول الفناء.')]))
book+=section('One garden, three lights','حديقة واحدة في ثلاثة أضواء',trio([('courtyard','Porcelain','الخزف','Cobalt gives the pale ground a crisp edge.','يرسم الأزرق الكوبالتي حدوداً واضحة على الأرضية الفاتحة.'),('reverse','Cobalt','الكوبالت','Pale leaves turn the edge into a ring of light.','تصنع الأوراق الفاتحة طوقاً من نور.'),('evening','Dusk','الغسق','Gold warms the violet shade.','يمنح الذهبي الظل البنفسجي دفئاً.')]))
book+=section('Field and ornament','النسيج والزخرفة',trio([('grid','Eight-fold construction','هندسة ثمانية','Diagonals and axes locate the points of a star in a square repeat.','تحدّد الأقطار والمحاور رؤوس النجمة في وحدة مربّعة.'),('field','Star and neighbour','النجمة وجارتها','After the atlas’s Andalusi khatam study. Porcelain picks out the crosses between cobalt stars.','دراسة تستلهم الخاتم الأندلسي في الأطلس. يكشف لون الخزف الأشكال المتصالبة بين النجوم الزرقاء.'),('bloom-grid','Six-fold construction','هندسة سداسية','One curved leaf turns in steps of sixty degrees.','تتكرر الورقة المنحنية بدوران قدره ستون درجة.'),('bloom','Botanical medallion','جامة نباتية','A contemporary study after the atlas’s Ottoman Rumi family. Six tips turn around a small opening.','دراسة معاصرة تستلهم زخارف الرومي العثمانية. تدور ستّ وريقات حول فراغ صغير.')]))
(p/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Quiet Centre · Firdawsi</title><style>*{box-sizing:border-box}body{margin:0 auto;max-width:1300px;background:#faf4e8;color:#25253a;padding:4vw;font:17px/1.55 Georgia,serif}a{color:#2639a5}header{margin:3em 0}h1,h2,h3{font-weight:normal;line-height:1.2}h1{font-size:clamp(44px,7vw,96px);margin:.35em 0}h2{font-size:clamp(28px,4vw,52px)}section{border-top:1px solid #afa99b;padding:1em 0 3em}.plates{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,245px),1fr));gap:2vw}figure{margin:0}img{display:block;width:100%;border:1px solid #d8cfbf}span[lang]{display:block;font-family:serif;line-height:1.65}h2 span,h3 span{color:#504166}figcaption{padding:.6em 0}h3{font-size:1.35em;margin:.3em 0}section:last-child .plates{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:600px){section:last-child .plates{grid-template-columns:1fr}}@media print{@page{size:A4 landscape;margin:12mm}body{padding:0;font-size:11pt}section{break-before:page}figure{break-inside:avoid}a{display:none}section:last-child img{max-height:44mm}}header{position:relative;padding:2.5em 34% 2.5em 0;border-block:1px solid #afa99b;background:url(bloom.svg) right center/32% auto no-repeat}header span[lang]{text-align:start}header p{max-width:42em}header a{display:inline-block;padding:.6em 1em;background:#2639a5;color:#faf4e8;text-decoration:none}h2 span[lang]{font-size:.72em}figure img{aspect-ratio:5/4}a:focus-visible{outline:3px solid #504166;outline-offset:4px}@media(max-width:650px){header{padding:1em 0 36vw;background-position:center bottom;background-size:auto 36vw}.plates{grid-template-columns:1fr}}@media print{header a{display:none}}</style><main><a href="/#overview">← Firdawsi / فردوسي</a><header><h1>The Quiet Centre<span lang="ar" dir="rtl">الفناء الهادئ</span></h1><p>A visual study of welcome, light and repetition in Firdawsi’s gardens.<span lang="ar" dir="rtl">دراسة بصرية في الترحيب والضوء والتكرار في حدائق فردوسي.</span></p><a href="quiet-centre.pdf" download>Download the book · تنزيل الكتاب</a></header>'''+book+'<p><a href="leaves/">Light Through Leaves · الضوء بين الأوراق →</a></p></main></html>')

# Each print spread pairs complete artwork with bilingual typeset captions.
spreads = [
    ('The Quiet Centre', 'الفناء الهادئ', ['courtyard', 'construction']),
    ('Gardens of light', 'حدائق النور', ['threshold', 'courtyard', 'water']),
    ('Principles in a drawing', 'المبادئ في الرسم', ['courtyard', 'rest', 'balance']),
    ('One garden, three lights', 'حديقة واحدة في ثلاثة أضواء', ['courtyard', 'reverse', 'evening']),
    ('Star and neighbour', 'النجمة وجارتها', ['grid', 'field']),
    ('Botanical medallion', 'جامة نباتية', ['bloom-grid', 'bloom']),
]

def lettering(x, y, label, size, arabic=False):
    direction = 'direction="rtl" unicode-bidi="embed" xml:lang="ar"' if arabic else ''
    return f'<text x="{x}" y="{y}" {direction} font-size="{size}" fill="#25253a">{escape(label)}</text>'

def print_spread(title, translation, names):
    page = ['<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 1188 840">',
            f'<rect width="1188" height="840" fill="{white}"/>',
            lettering(48, 60, 'FIRDAWSI', 20), lettering(1140, 60, 'فردوسي', 23, True),
            lettering(48, 135, title, 48), lettering(1140, 135, translation, 39, True)]
    width = (1092 - 28 * (len(names) - 1)) / len(names)
    for index, name in enumerate(names):
        left = 48 + index * (width + 28)
        right = left + width
        art = (p / f'{name}.svg').read_text().replace('<svg ', f'<svg x="{left}" y="185" width="{width}" height="330" ', 1)
        art = art.replace('id="tile"', f'id="tile-{index}"').replace('url(#tile)', f'url(#tile-{index})')
        page.append(art)
        en, ar_title, caption, arabic = plates[name]
        if name == 'courtyard' and title.startswith('Principles'):
            en, ar_title = 'Welcome', 'الترحيب'
        if name == 'courtyard' and title.startswith('One garden'):
            en, ar_title = 'Porcelain', 'الخزف'
        page.extend([lettering(left, 565, en, 26), lettering(right, 605, ar_title, 27, True)])
        for line, words in enumerate(wrap(caption, int(width / 10))):
            page.append(lettering(left, 647 + line * 24, words, 18))
        for line, words in enumerate(wrap(arabic, int(width / 12))):
            page.append(lettering(right, 745 + line * 26, words, 20, True))
    return ''.join(page) + '</svg>'

with TemporaryDirectory() as temp:
    pages = []
    for index, spread in enumerate(spreads):
        page = Path(temp) / f'{index}.svg'
        page.write_text(print_spread(*spread))
        pages.append(page)
    run(['rsvg-convert', '-f', 'pdf', '-o', p / 'quiet-centre.pdf', *pages], check=True)
