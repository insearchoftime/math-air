/* Math Air learning labs. All conversations and feature annotations are fictional.
 * No model or private API runs here: the semantic coordinates are a declared
 * teaching model. Lexical vectors, cosine, k-means and PCA are computed locally. */
(function () {
  'use strict';
  const TOPICS = {ru:['Изображение','Музыка','Работа','Поездки'],en:['Visual art','Music','Work','Travel']};
  const PEOPLE = {mira:['Мира','Mira'],anton:['Антон','Anton'],lena:['Лена','Lena'],kirill:['Кирилл','Kirill']};
  // id, contact, date, my line RU/EN, reply RU/EN, feature annotations for each line.
  const ROWS = [
    ['01','mira','2026-06-03','Пойдём на выставку в субботу? Там показывают новые фотографии.','Shall we go to the exhibition on Saturday? There are new photographs.','Хочу посмотреть, как там работают со светом.','I want to see how they work with light.',[1,0,0,0],[1,0,0,0]],
    ['02','lena','2026-06-07','Хочу посмотреть современную живопись. Нашла маленькую галерею.','I want to see contemporary painting. I found a small gallery.','Да, давай.','Yes, let’s do it.',[1,0,0,0],[0,0,0,0]],
    ['03','anton','2026-06-10','Слушаю этот джазовый альбом третий раз. Особенно нравится бас.','I am listening to this jazz album for the third time. I love the bass.','Пришли запись, послушаю вечером в наушниках.','Send me the recording. I will listen with headphones tonight.',[0,1,0,0],[0,1,0,0]],
    ['04','kirill','2026-06-12','В отчёте снова не сходятся числа. Давай проверим расчёт.','The numbers in the report do not match again. Let’s check the calculation.','Сравню исходные данные и пришлю исправленную таблицу.','I will compare the source data and send the corrected table.',[0,0,1,0],[0,0,1,0]],
    ['05','lena','2026-06-15','Хочется уехать к морю хотя бы на неделю.','I want to go to the sea for at least a week.','Посмотрю билеты и жильё. В июле у меня отпуск.','I will look at tickets and accommodation. I have a holiday in July.',[0,0,0,1],[0,0,0,1]],
    ['06','mira','2026-06-19','Нужен эскиз обложки для нового проекта. Успеем до пятницы?','We need a cover sketch for the new project. Can we finish by Friday?','Сделаю два варианта композиции и отправлю заказчику.','I will make two compositions and send them to the client.',[.65,0,.75,0],[.7,0,.65,0]],
    ['07','anton','2026-06-22','Вечером играют квартетом в маленьком зале. Пойдём на концерт?','A quartet is playing in a small hall tonight. Shall we go to the concert?','Я с вами. Возьму билеты у входа.','I am coming. I will get tickets at the door.',[0,1,0,0],[0,.8,0,0]],
    ['08','kirill','2026-06-27','На выходных хочу пройти маршрут вдоль озера.','This weekend I want to hike the trail along the lake.','Скинь точку старта, проверю дорогу и возьму палатку.','Send the starting point. I will check the route and bring a tent.',[0,0,0,1],[0,0,0,1]],
    ['09','mira','2026-07-02','Сняла серию портретов. Не могу выбрать между цветом и чёрно-белым.','I took a series of portraits. I cannot choose between colour and black and white.','В чёрно-белом лучше видны лица. Покажи ещё пару кадров.','The faces stand out in black and white. Show me a few more frames.',[1,0,0,0],[1,0,0,0]],
    ['10','anton','2026-07-05','Запишем короткую мелодию для заставки? Клиент ждёт демо.','Shall we record a short melody for the intro? The client is waiting for a demo.','Да. Набросаю партию на синтезаторе и пришлю файл к обеду.','Yes. I will sketch a synthesizer part and send the file by lunch.',[0,.85,.55,0],[0,.9,.45,0]],
    ['11','lena','2026-07-09','Мечтаю об отпуске без расписания. Просто гулять по незнакомому городу.','I dream of a holiday without a schedule. Just walking around an unfamiliar city.','Нашла квартиру рядом с вокзалом. Можно добраться поездом.','I found an apartment near the station. We can get there by train.',[0,0,0,1],[0,0,0,1]],
    ['12','kirill','2026-07-11','На встрече договорились сократить первую версию приложения.','At the meeting we agreed to reduce the first version of the application.','Тогда перенесу поиск в следующий релиз. Завтра обновлю задачи.','Then I will move search to the next release. I will update the tasks tomorrow.',[0,0,1,0],[0,0,1,0]],
    ['13','mira','2026-07-15','В поездке хочу зарисовать старые дома и узкие улицы.','On the trip I want to sketch old houses and narrow streets.','Возьми маленький блокнот. В том городе много красивых фасадов.','Take a small sketchbook. That city has many beautiful facades.',[.8,0,0,.7],[.8,0,0,.6]],
    ['14','anton','2026-07-18','Хочу разобрать на слух эту песню и сыграть её на пианино.','I want to learn this song by ear and play it on the piano.','Начни с басовой линии, потом подберём аккорды.','Start with the bass line, then we will work out the chords.',[0,1,0,0],[0,1,0,0]],
    ['15','lena','2026-07-23','В музее увидела керамику с простыми геометрическими узорами.','At the museum I saw pottery with simple geometric patterns.','Пришли фото. Хочу попробовать похожую роспись на чашке.','Send a photo. I want to try a similar pattern on a cup.',[1,0,0,0],[1,0,0,0]],
    ['16','kirill','2026-07-28','Предлагают выступить с докладом в другом городе. Поедем вместе?','We have been invited to give a talk in another city. Shall we go together?','Да. Сначала согласую рабочую поездку, потом забронируем поезд.','Yes. I will get the work trip approved, then we can book the train.',[0,0,.75,.7],[0,0,.75,.7]],
    ['17','mira','2026-08-03','Показываю заказчику макет завтра. Нужен свежий взгляд на структуру.','I am showing the layout to the client tomorrow. I need a fresh look at the structure.','Прочитаю вечером. Проверю порядок разделов и подписи.','I will read it tonight. I will check the order of sections and captions.',[.35,0,.9,0],[.2,0,1,0]],
    ['18','anton','2026-08-07','На фестивале можно пожить в палатке и три дня слушать группы.','At the festival we can camp and listen to bands for three days.','Отлично. Посмотрю программу и маршрут до площадки.','Great. I will check the programme and the route to the venue.',[0,.8,0,.75],[0,.65,0,.6]],
    ['19','lena','2026-08-10','Билеты уже куплены, осталось решить, где остановимся.','The tickets are booked. We still need to decide where to stay.','Я нашла тихий дом в десяти минутах от пляжа.','I found a quiet house ten minutes from the beach.',[0,0,0,1],[0,0,0,1]],
    ['20','kirill','2026-08-14','После обновления поиск стал медленнее. Посмотрим логи?','Search became slower after the update. Shall we look at the logs?','Нашёл лишний запрос к базе. Сегодня исправлю.','I found an extra database query. I will fix it today.',[0,0,1,0],[0,0,1,0]],
    ['21','mira','2026-08-18','Хочу сделать коллаж из цветных вырезок и старых писем.','I want to make a collage from coloured cutouts and old letters.','Попробуй оставить больше пустого места между фрагментами.','Try leaving more empty space between the pieces.',[1,0,0,0],[1,0,0,0]],
    ['22','anton','2026-08-21','Мне совсем не понравился этот альбом. Всё звучит одинаково.','I really disliked this album. Everything sounds the same.','А мне понравился. Особенно последняя композиция.','I liked it. Especially the last track.',[0,1,0,0],[0,1,0,0]],
    ['23','lena','2026-08-25','Поможешь собрать презентацию? Картинки есть, текста пока слишком много.','Will you help me put the presentation together? I have the images, but too much text.','Сначала выберем главную мысль каждого слайда, потом уберём лишнее.','Let’s choose the main point of each slide first, then remove the extra text.',[.5,0,.8,0],[.3,0,.9,0]],
    ['24','kirill','2026-08-29','Возьмём гитару в поход? Вечером у костра можно поиграть.','Shall we take a guitar on the hike? We could play by the campfire tonight.','Возьмём. Я помню несколько песен, а дорога будет долгой.','Let’s take it. I remember a few songs, and it is a long journey.',[0,.7,0,.8],[0,.6,0,.7]]
  ];
  const DATA=ROWS.map(r=>({id:r[0],person:r[1],date:r[2],text:{ru:[r[3],r[5]],en:[r[4],r[6]]},vectors:[r[7],r[8]]}));
  const C = {
    ru: {
      route:['Векторы и похожесть','Текст как пространство','Карта разговоров'],
      vectorDesc:'Сначала — две стрелки. Затем — текст с несколькими координатами. Посмотрите, что измеряют длина, угол и скалярное произведение.',
      angleTitle:'Два способа быть похожими',angleDesc:'Угол отвечает за направление. Длина влияет на скалярное произведение. Нормализация позволяет сравнить только направления.',
      angleA:'Направление u',angleB:'Направление v',lengthA:'Длина u',lengthB:'Длина v',normalize:'Привести обе стрелки к единичной длине',
      presets:['В одну сторону','Под прямым углом','В разные стороны','Нулевой вектор'],
      cosine:'Косинус',dot:'Скалярное произведение',angle:'Угол между',rawLength:'Исходные длины',drawnLength:'Длины на рисунке',
      vectorNote:'Поверните v, оставляя длины прежними. Затем измените длину: косинус останется тем же, а скалярное произведение изменится.',
      zero:'У нулевого вектора нет направления. Поэтому угол и косинус с ним не определены; нормировать его тоже нельзя.',
      formula:'cos(u, v) = (u · v) / (‖u‖ ‖v‖)',
      fourTitle:'Четыре координаты вместо двух',fourDesc:'Для учебного примера каждому разговору вручную заданы веса четырёх тем. По ним уже можно вычислять близость. В нейросетевом эмбеддинге координат обычно гораздо больше, и у них нет таких простых названий.',
      compare:'Сравнить с фрагментом',vectorFirst:'Первый фрагмент',vectorSecond:'Второй фрагмент',topics:'Координаты выбранного фрагмента',manual:'Учебная модель · координаты заданы вручную',
      fourNote:'В обеих репликах может быть музыка, даже если авторы не согласны в оценке альбома. Здесь мы сравниваем темы разговора.',
      textDesc:'Одни и те же 24 вымышленных разговора можно описать словами, темами или нейросетевыми эмбеддингами. Сравните ближайших соседей и проверьте, что изменилось.',
      textTitle:'Как представить фрагмент',textCardDesc:'Выберите реплику, затем смените способ представления. Числа справа вычисляются заново для всего набора.',
      select:'Фрагмент разговора',mode:'Представление',embedding:'Нейросетевой эмбеддинг · 384D',embeddingNote:'Эти векторы заранее вычислены моделью paraphrase-multilingual-MiniLM-L12-v2 отдельно для русских и английских диалогов и ответов. Здесь показаны первые восемь координат из 384. У них нет отдельных названий тем. Страница загружает готовые числа и выполняет операции локально.',embeddingFeatures:'Первые 8 из 384 координат',semantic:'Темы · учебная модель',lexical:'Леммы · TF–IDF',unit:'Единица анализа',episode:'Диалог из двух реплик',reply:'Только ответ',
      source:'Исходный текст',tokens:'Леммы после обработки',tokenNote:'Здесь работает небольшой словарь для примеров, а не полноценный морфологический анализатор. Служебные слова исключены. Лемматизация не обязательна перед нейросетевым эмбеддингом.',
      semanticNote:'Это наглядная модель по четырём заранее размеченным темам. Настоящая модель эмбеддингов получает вектор из текста; этот сайт её не запускает. Операции над векторами здесь настоящие.',
      nearest:'Ближайшие фрагменты',nearestDesc:'Косинусная близость к выбранному фрагменту. Нажмите на соседа, чтобы выбрать его.',
      zeroNeighbors:'Общих лемм нет: все сходства нулевые. Порядок этих фрагментов произволен и ничего не говорит об их близости.',
      overlapNote:'Совпадающие точки немного раздвинуты, чтобы можно было выбрать каждую. Это сдвиг только на рисунке: координаты PCA, группы и значения близости не меняются.',
      separatedPoint:'Точка раздвинута для выбора',
      noDirection:'В этом представлении фрагмент дал нулевой вектор. У него нельзя искать соседей по косинусу. Верните контекст или выберите другой пример.',
      mapTitle:'Соседи, группы и плоскость',mapDesc:'Каждая точка — один фрагмент. Группы ищутся в полном пространстве признаков, затем PCA проецирует точки на плоскость.',
      clusters:'Число групп k',cluster:'Группа',projection:'PCA · две компоненты',variance:'сохранено дисперсии',component1:'Компонента 1',component2:'Компонента 2',
      clusteringNote:'K-means относит каждую точку к ближайшему центру и пересчитывает центры. Число групп выбираете вы. У групп нет автоматических названий; их смысл нужно проверять по репликам.',
      projectionNote:'Расстояния на плоскости могут отличаться от расстояний между исходными векторами. Ближайшие соседи в списке найдены до проекции. Цвет и номер обозначают группу.',
      how:'Что именно здесь считается?',howText:'Для словарного представления считаются TF–IDF-веса лемм. В тематическом используются четыре явно заданных веса. Нейросетевые эмбеддинги содержат 384 заранее вычисленные координаты. Перед k-means ненулевые векторы приводятся к единичной длине. PCA строится по тем же векторам, с вычитанием среднего. Нулевые векторы не участвуют в поиске соседей, группировке и проекции.',
      chatDesc:'Теперь добавим собеседников и время. В этой лаборатории темы уже размечены вручную: можно проверить, как из отдельных реплик получается общая картина.',
      chatTitle:'С кем и о чём',chatCardDesc:'Числа относятся к фрагментам диалога. Одна переписка может содержать несколько тем.',
      person:'Собеседник',allPeople:'Все собеседники',period:'Месяц',allMonths:'Все месяцы',months:['Июнь','Июль','Август'],speaker:'Чьи реплики учитывать',both:'Обе стороны',me:'Мои',them:'Собеседника',
      assignment:'Темы фрагмента',multi:'Несколько тем',single:'Одна главная тема',count:'Количество',share:'Доля',matrixCaption:'Нажмите на ячейку, чтобы прочитать фрагменты за этим числом.',
      fragments:'фрагментов',unknown:'без темы',total:'Всего',showing:'Выбрано',clear:'Сбросить ячейку',quotes:'Исходные разговоры',empty:'Для этих условий фрагментов нет. Смените месяц, собеседника или выбранную тему.',
      chatNote:'Доля — это число фрагментов с темой, делённое на число фрагментов у данного собеседника за выбранный месяц. В режиме нескольких тем сумма долей может превышать 100%.',
      noTopics:'Тема не определена',meName:'Я',topicRule:'Как назначаются темы',topicRuleText:'Для обеих сторон берётся средний вектор двух реплик. Для одной стороны — вектор её сообщения. В режиме нескольких тем отмечаются координаты не меньше 35% от наибольшей ненулевой координаты. В режиме одной темы остаётся только максимальная. Короткий ответ без контекста может остаться без темы.',
      fixture:'Все имена, даты и реплики вымышлены. Ничего не загружается и не отправляется на сервер.',
      endNote:'В реальном архиве следующий шаг — проверить разметку на выборке разговоров и уточнить спорные темы. Одна точка на человека скрыла бы различия между его разговорами.',
      nextText:'Дальше: от стрелок к тексту →',nextChat:'Дальше: с кем и о чём →',back:'Вернуться к векторам ↑',read:'Читать фрагмент',more:'Про эмбеддинги',wordModel:'Слова',topicModel:'Темы',short:'ответ',whole:'диалог',
      directions:'u — сплошная, v — пунктирная',noProjection:'Для проекции нужны хотя бы два ненулевых вектора.',selected:'Выбранный фрагмент',normalization:'Нормализация меняет длину, но сохраняет направление. Для единичных векторов скалярное произведение равно косинусу.',
      clusterSize:'точек',explanation:'Название темы появляется после просмотра характерных текстов. Для резюме нужен ещё один шаг: отобрать исходные реплики и сформулировать их содержание.',
      notProbability:'Близость 0,8 не означает «80% вероятности одинакового смысла». Результат зависит от представления текста и выбранной меры.'
    },
    en: {
      route:['Vectors & similarity','Text as space','Conversation map'],
      vectorDesc:'Start with two arrows, then give a piece of text several coordinates. See what length, angle and the dot product actually measure.',
      angleTitle:'Two ways to be similar',angleDesc:'The angle describes direction. Length also affects the dot product. Normalization lets us compare directions alone.',
      angleA:'Direction of u',angleB:'Direction of v',lengthA:'Length of u',lengthB:'Length of v',normalize:'Give both arrows unit length',
      presets:['Same direction','Right angle','Opposite directions','Zero vector'],
      cosine:'Cosine',dot:'Dot product',angle:'Angle between',rawLength:'Original lengths',drawnLength:'Lengths on the plot',
      vectorNote:'Rotate v without changing either length. Then change its length: cosine stays the same, while the dot product changes.',
      zero:'A zero vector has no direction. Its angle and cosine with another vector are undefined; it cannot be normalized.',
      formula:'cos(u, v) = (u · v) / (‖u‖ ‖v‖)',
      fourTitle:'Four coordinates instead of two',fourDesc:'For this teaching example, each conversation has four manually assigned topic weights. We can already calculate similarity from them. A neural embedding usually has many more coordinates, without simple labels like these.',
      compare:'Compare with a fragment',vectorFirst:'First fragment',vectorSecond:'Second fragment',topics:'Coordinates of the selected fragment',manual:'Teaching model · manually assigned coordinates',
      fourNote:'Both messages can be about music even when the writers disagree about an album. This representation compares topics.',
      textDesc:'The same 24 fictional conversations can be represented by words, topics or neural embeddings. Compare their nearest neighbours and inspect what changes.',
      textTitle:'Choose a representation',textCardDesc:'Choose a conversation, then change its representation. The calculations on the right update for the whole set.',
      select:'Conversation fragment',mode:'Representation',embedding:'Neural embedding · 384D',embeddingNote:'These vectors were precomputed with paraphrase-multilingual-MiniLM-L12-v2 separately for Russian and English dialogues and replies. These are the first eight of 384 coordinates, without individual topic labels. This page loads the numbers and performs the vector operations locally.',embeddingFeatures:'First 8 of 384 coordinates',semantic:'Topics · teaching model',lexical:'Lemmas · TF–IDF',unit:'Unit of analysis',episode:'Two-message conversation',reply:'Reply alone',
      source:'Source text',tokens:'Lemmas after processing',tokenNote:'A small dictionary handles these examples; this is not a full morphological analyser. Stop words are removed. Lemmatization is not required before a neural embedding.',
      semanticNote:'This is a visual model with four manually annotated topics. An actual embedding model obtains a vector from text; this site does not run one. The vector operations here are real.',
      nearest:'Nearest fragments',nearestDesc:'Cosine similarity to the selected fragment. Choose a neighbour to inspect it.',
      zeroNeighbors:'There are no shared lemmas: every similarity is zero. The order of these fragments is arbitrary and does not indicate closeness.',
      overlapNote:'Coincident points are spread slightly so that each can be selected. This affects the drawing only: PCA coordinates, groups and similarity scores stay unchanged.',
      separatedPoint:'Point spread for selection',
      noDirection:'This fragment has a zero vector in the selected representation. Cosine neighbours are undefined. Restore the context or choose another example.',
      mapTitle:'Neighbours, groups and a plane',mapDesc:'Each point is one fragment. Groups are found in the full feature space; PCA then projects the points onto a plane.',
      clusters:'Number of groups k',cluster:'Group',projection:'PCA · two components',variance:'variance retained',component1:'Component 1',component2:'Component 2',
      clusteringNote:'K-means assigns each point to its nearest centre and updates the centres. You choose the number of groups. Groups have no automatic names; check their meaning against the messages.',
      projectionNote:'Distances on the plane may differ from the original vector distances. Nearest neighbours are calculated before projection. Colour and number identify the group.',
      how:'What is calculated here?',howText:'The word representation uses lemma TF–IDF weights. The topic representation uses four declared weights. Neural embeddings contain 384 precomputed coordinates. Nonzero vectors are normalized before k-means. PCA uses the same vectors after mean centring. Zero vectors are excluded from neighbours, clustering and projection.',
      chatDesc:'Now add people and time. Topics are manually annotated in this lab, so you can check how individual messages become an overview.',
      chatTitle:'Who talks about what',chatCardDesc:'Each count refers to a conversation fragment. A conversation may touch several topics.',
      person:'Contact',allPeople:'All contacts',period:'Month',allMonths:'All months',months:['June','July','August'],speaker:'Whose messages to include',both:'Both sides',me:'Mine',them:'Contact’s',
      assignment:'Topics per fragment',multi:'Several topics',single:'One main topic',count:'Count',share:'Share',matrixCaption:'Choose a cell to read the fragments behind its number.',
      fragments:'fragments',unknown:'without a topic',total:'Total',showing:'Selected',clear:'Clear cell selection',quotes:'Source conversations',empty:'No fragments match these conditions. Change the month, contact or selected topic.',
      chatNote:'Share means fragments with a topic divided by all fragments for that contact in the selected month. With several topics per fragment, shares can add up to more than 100%.',
      noTopics:'No topic assigned',meName:'Me',topicRule:'How topics are assigned',topicRuleText:'For both sides, we average the two message vectors. For one side, we use that message’s vector. With several topics, a coordinate must be at least 35% of the largest nonzero coordinate. With one topic, only the largest remains. A short reply without context may have no topic.',
      fixture:'All names, dates and messages are fictional. Nothing is uploaded or sent to a server.',
      endNote:'For a real archive, the next step is to check a sample of conversations and refine ambiguous topics. One point per person would hide the differences between their conversations.',
      nextText:'Next: from arrows to text →',nextChat:'Next: who talks about what →',back:'Back to vectors ↑',read:'Read fragment',more:'About embeddings',wordModel:'Words',topicModel:'Topics',short:'reply',whole:'dialogue',
      directions:'u — solid, v — dashed',noProjection:'The projection needs at least two nonzero vectors.',selected:'Selected fragment',normalization:'Normalization changes length while keeping direction. For unit vectors, the dot product equals cosine.',
      clusterSize:'points',explanation:'A topic name comes after inspecting representative texts. A summary needs one more step: select the source messages and describe their content.',
      notProbability:'A similarity of 0.8 does not mean an “80% probability of the same meaning”. Results depend on the representation and the similarity measure.'
    }
  };
  const S={a:25,b:70,la:2,lb:3,norm:false,first:'01',second:'02',selected:'01',mode:window.MathAirEmbeddings?'embedding':'semantic',unit:'episode',k:4,person:'all',month:'all',speaker:'both',assignment:'multi',view:'count',cell:null};
  let lang='en',el,canvasObserver;
  const q=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*(b[i]||0),0);
  const length=a=>Math.sqrt(dot(a,a));
  const normalize=a=>{const n=length(a);return n>1e-12?a.map(v=>v/n):a.map(()=>0);};
  const cosine=(a,b)=>{const d=length(a)*length(b);return d>1e-12?Math.max(-1,Math.min(1,dot(a,b)/d)):null;};
  const mean=vs=>vs[0].map((_,j)=>vs.reduce((s,v)=>s+v[j],0)/vs.length);
  const find=id=>DATA.find(d=>d.id===id);
  const text=d=>S.unit==='reply'?d.text[lang][1]:d.text[lang].join(' ');
  const feature=(d,unit=S.unit)=>unit==='reply'?d.vectors[1]:mean(d.vectors);
  const personName=id=>PEOPLE[id][lang==='ru'?0:1];
  const topicName=i=>TOPICS[lang][i];
  const fmt=(v,d=2)=>v===null?'—':v.toLocaleString(lang==='ru'?'ru-RU':'en-GB',{minimumFractionDigits:d,maximumFractionDigits:d});
  function counted(n,type='fragment') {
    if(lang==='en')return n+' '+(type==='point'?'point':'fragment')+(n===1?'':'s');
    const forms=type==='point'?['точка','точки','точек']:['фрагмент','фрагмента','фрагментов'];
    const last=n%10,lastTwo=n%100,index=lastTwo>=11&&lastTwo<=14?2:last===1?0:last>=2&&last<=4?1:2;
    return n+' '+forms[index];
  }
  const route=n=>'<div class="lab-route">'+C[lang].route.map((label,i)=>`<a href="#${['vectors','text-space','conversations'][i]}"${i===n?' aria-current="step"':''}>0${i+1} · ${label}</a>`).join('')+'</div>';
  const options=(selected,short=false)=>DATA.map(d=>`<option value="${d.id}"${d.id===selected?' selected':''}>${d.id} · ${esc((short?d.text[lang][0].slice(0,56):d.text[lang][0]))}${short&&d.text[lang][0].length>56?'…':''}</option>`).join('');
  const select=(id,label,opts,wide=false)=>`<div class="lab-field${wide?' lab-field-wide':''}"><label for="${id}">${label}</label><select id="${id}">${opts}</select></div>`;
  const range=(id,label,value,min,max,step,suffix)=>`<div class="lab-field"><label for="${id}">${label} <output id="${id}-value">${value}${suffix}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"/></div>`;
  const metric=(label,value)=>`<div class="lab-metric"><span>${label}</span><strong>${value}</strong></div>`;
  const coordinates=(vector)=>vector.map((v,i)=>`<div class="lab-coordinate"><span>${topicName(i)}</span><div class="lab-coordinate-track"><div class="lab-coordinate-fill" style="width:${Math.min(100,v*100)}%"></div></div><output>${fmt(v)}</output></div>`).join('');
  const STOP={ru:new Set('и в во на к ко с со по а но я мы ты вы он она они это этот эта эти там тут у из до от за об про не бы же уже как что чтобы если то да нет мне меня мне мой мою у нас вас его ее её их для при без ещё еще только тоже есть будет будут было была были был очень все всё эту этом том тот того там либо или ли чем чем бы даже хотя хотя'.split(' ')),en:new Set('a an the and or but i we you he she it they this that these those to of on in at for from with by as is are was were be been have has had will would can could shall should do does did not no yes me my our your his her their its us them there here then so some any more again let lets am up out into than at least all very just how what when where which'.split(' '))};
  const LEMMAS={
    ru:{выставку:'выставка',выставке:'выставка',фотографии:'фотография',фотографий:'фотография',фото:'фотография',картинки:'изображение',изображения:'изображение',билеты:'билет',билетов:'билет',билета:'билет',поездки:'поездка',поездке:'поездка',поездку:'поездка',городе:'город',городу:'город',города:'город',галерею:'галерея',музее:'музей',дома:'дом',доме:'дом',домов:'дом',улицы:'улица',портретов:'портрет',портреты:'портрет',кадров:'кадр',кадры:'кадр',клиенту:'клиент',клиента:'клиент',заказчику:'заказчик',заказчика:'заказчик',работают:'работать',работы:'работа',рабочую:'работа',рабочей:'работа',проекту:'проект',проекта:'проект',проекты:'проект',нового:'новый',новые:'новый',новую:'новый',новой:'новый',альбома:'альбом',альбоме:'альбом',запись:'запись',запишем:'записать',записать:'записать',песню:'песня',песни:'песня',аккорды:'аккорд',мелодию:'мелодия',композиция:'композиция',композиции:'композиция',концерте:'концерт',концерта:'концерт',послушаю:'слушать',слушаю:'слушать',слушать:'слушать',понравился:'нравиться',нравится:'нравиться',понравилась:'нравиться',возьму:'взять',возьми:'взять',возьмём:'взять',возьмем:'взять',взять:'взять',поедем:'ехать',уехать:'ехать',добраться:'ехать',прислать:'прислать',пришли:'прислать',пришлю:'прислать',скинь:'прислать',посмотрим:'посмотреть',посмотрю:'посмотреть',посмотреть:'посмотреть',сделаю:'сделать',сделать:'сделать',проверим:'проверить',проверю:'проверить',проверить:'проверить',поездом:'поезд',поезда:'поезд',поезду:'поезд',слайда:'слайд',слайды:'слайд',фрагментами:'фрагмент',фрагменты:'фрагмент',расчёты:'расчёт',расчета:'расчёт',расчёт:'расчёт',данные:'данные',данных:'данные',таблицу:'таблица',таблицы:'таблица',макета:'макет',приложения:'приложение',обновления:'обновление',палатке:'палатка',палатку:'палатка',маршрута:'маршрут',гитару:'гитара',гитаре:'гитара',озера:'озеро',озеру:'озеро',морю:'море',моря:'море',жильё:'жильё',пустого:'пустой',хочется:'хотеть',хочу:'хотеть'},
    en:{photographs:'photograph',photos:'photograph',pictures:'picture',images:'image',tickets:'ticket',trips:'trip',cities:'city',houses:'house',portraits:'portrait',faces:'face',frames:'frame',patterns:'pattern',cutouts:'cutout',letters:'letter',pieces:'piece',songs:'song',chords:'chord',bands:'band',playing:'play',plays:'play',played:'play',listening:'listen',liked:'like',likes:'like',disliked:'dislike',recording:'record',recorded:'record',numbers:'number',logs:'log',tasks:'task',sections:'section',captions:'caption',slides:'slide',calculations:'calculation',reports:'report',messages:'message',coordinates:'coordinate',travelling:'travel',walking:'walk',working:'work',works:'work',waiting:'wait',showing:'show',booked:'book',approved:'approve',camping:'camp',staying:'stay',going:'go',sent:'send',found:'find',took:'take',coming:'come',invited:'invite',coloured:'colour'}
  };
  function lemmas(s) {
    const tokens=s.toLocaleLowerCase(lang==='ru'?'ru-RU':'en-GB').match(/[\p{L}\p{N}]+/gu)||[];
    return tokens.filter(w=>!STOP[lang].has(w)).map(w=>LEMMAS[lang][w]||w);
  }
  function wordVectors() {
    const docs=DATA.map(d=>lemmas(text(d))),vocab=[...new Set(docs.flat())].sort();
    const df=vocab.map(w=>docs.reduce((n,doc)=>n+(doc.includes(w)?1:0),0));
    return docs.map(doc=>vocab.map((w,i)=>{const n=doc.filter(t=>t===w).length;return n?(1+Math.log(n))*(1+Math.log((DATA.length+1)/(df[i]+1))):0;}));
  }
  function kmeans(vectors,k) {
    const active=vectors.map((v,i)=>({v,i})).filter(o=>length(o.v)>1e-12);
    const labels=vectors.map(()=>-1);
    if(!active.length)return {labels,centres:[]};
    const centres=[active[0].v.slice()];
    const dist=(a,b)=>a.reduce((s,v,i)=>s+(v-b[i])**2,0);
    while(centres.length<Math.min(k,active.length)){
      let best=null,bestD=-1;
      active.forEach(o=>{const d=Math.min(...centres.map(c=>dist(o.v,c)));if(d>bestD){best=o;bestD=d;}});
      if(bestD<1e-12)break;
      centres.push(best.v.slice());
    }
    for(let pass=0;pass<60;pass++){
      let changed=false;
      active.forEach(o=>{const ds=centres.map(c=>dist(o.v,c)),next=ds.indexOf(Math.min(...ds));if(labels[o.i]!==next){labels[o.i]=next;changed=true;}});
      if(!changed)break;
      centres.forEach((_,c)=>{const members=active.filter(o=>labels[o.i]===c).map(o=>o.v);if(members.length)centres[c]=mean(members);});
    }
    return {labels,centres};
  }
  function pca(vectors) {
    const active=vectors.map((v,i)=>({v,i})).filter(o=>length(o.v)>1e-12);
    const coords=vectors.map(()=>null);
    if(active.length<2)return {coords,retained:0};
    const centre=mean(active.map(o=>o.v)),X=active.map(o=>o.v.map((v,j)=>v-centre[j]));
    const G=X.map(a=>X.map(b=>dot(a,b))),trace=G.reduce((s,row,i)=>s+row[i],0);
    const basis=[],values=[];
    for(let component=0;component<2;component++){
      let v=normalize(active.map((_,i)=>Math.sin((i+1)*(component+1.31))));
      for(let pass=0;pass<150;pass++){
        let w=G.map(row=>dot(row,v));
        basis.forEach(b=>{const f=dot(w,b);w=w.map((x,i)=>x-f*b[i]);});
        if(length(w)<1e-12){v=w.map(()=>0);break;}
        const next=normalize(w),delta=next.reduce((s,x,i)=>s+(x-v[i])**2,0);v=next;if(delta<1e-18)break;
      }
      basis.push(v);values.push(Math.max(0,dot(v,G.map(row=>dot(row,v)))));
    }
    active.forEach((o,i)=>{coords[o.i]=basis.map((v,j)=>v[i]*Math.sqrt(values[j]));});
    return {coords,retained:trace>1e-12?Math.min(1,(values[0]+values[1])/trace):1};
  }
  function angleResults() {
    const r=Math.PI/180,rawA=[S.la*Math.cos(S.a*r),S.la*Math.sin(S.a*r)],rawB=[S.lb*Math.cos(S.b*r),S.lb*Math.sin(S.b*r)];
    const u=S.norm?normalize(rawA):rawA,v=S.norm?normalize(rawB):rawB,c=cosine(u,v);
    return {u,v,c,dot:dot(u,v),angle:c===null?null:Math.acos(c)/r};
  }
  function updateVectors() {
    const c=C[lang],r=angleResults();
    ['a','b','la','lb'].forEach(key=>{const suffix=key==='a'||key==='b'?'°':'';q('lab-'+key+'-value').textContent=fmt(S[key],suffix?0:1)+suffix;});
    q('lab-vector-metrics').innerHTML=metric(c.cosine,fmt(r.c,3))+metric(c.dot,fmt(r.dot,3))+metric(c.angle,r.angle===null?'—':fmt(r.angle,1)+'°');
    q('lab-vector-lengths').textContent=c.drawnLength+': ‖u‖ = '+fmt(length(r.u))+' · ‖v‖ = '+fmt(length(r.v));
    q('lab-vector-note').textContent=r.c===null?c.zero:(S.norm?c.normalization:c.vectorNote);
    drawVectors(r);
  }
  function drawVectors(r) {
    const canvas=q('lab-vector-canvas');if(!canvas)return;
    const W=canvas.clientWidth||480,H=300,dpr=window.devicePixelRatio||1;
    canvas.width=W*dpr;canvas.height=H*dpr;
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,W,H);
    const cx=W/2,cy=H/2,scale=Math.min(W-70,H-58)/(2*(S.norm?1.25:4.5));
    ctx.strokeStyle='#ececec';ctx.lineWidth=1;
    for(let n=-4;n<=4;n++){const p=n*scale;if(S.norm&&Math.abs(n)>1)continue;ctx.beginPath();ctx.moveTo(cx+p,20);ctx.lineTo(cx+p,H-20);ctx.stroke();ctx.beginPath();ctx.moveTo(20,cy+p);ctx.lineTo(W-20,cy+p);ctx.stroke();}
    ctx.strokeStyle='#ccc';ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();
    ctx.font='11px "DM Mono",monospace';ctx.fillStyle='#999';ctx.fillText('x',W-22,cy-8);ctx.fillText('y',cx+8,20);ctx.fillText('0',cx-12,cy+15);
    if(S.norm){ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(cx,cy,scale,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
    function arrow(v,name,dashed){
      if(length(v)<1e-12){ctx.fillStyle='#0a0a0a';ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fill();ctx.fillText(name+' = 0',cx+10,cy-10);return;}
      const x=cx+v[0]*scale,y=cy-v[1]*scale,a=Math.atan2(y-cy,x-cx);
      ctx.strokeStyle=dashed?'#777':'#0a0a0a';ctx.lineWidth=2.2;ctx.setLineDash(dashed?[7,5]:[]);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);
      ctx.beginPath();ctx.moveTo(x-9*Math.cos(a-.4),y-9*Math.sin(a-.4));ctx.lineTo(x,y);ctx.lineTo(x-9*Math.cos(a+.4),y-9*Math.sin(a+.4));ctx.stroke();
      ctx.fillStyle=dashed?'#666':'#0a0a0a';ctx.fillText(name,Math.max(10,Math.min(W-18,x+9)),Math.max(14,Math.min(H-8,y-8)));
    }
    arrow(r.u,'u',false);arrow(r.v,'v',true);
    canvas.setAttribute('aria-label',cLabel());
    function cLabel(){return C[lang].directions+'. '+C[lang].cosine+': '+(r.c===null?'—':fmt(r.c,3))+'. '+C[lang].angle+': '+(r.angle===null?'—':fmt(r.angle,1)+'°');}
  }
  function updateFour() {
    const a=feature(find(S.first),'episode'),b=feature(find(S.second),'episode');
    q('lab-four-coordinates').innerHTML=coordinates(a);
    q('lab-four-result').textContent=C[lang].cosine+': '+fmt(cosine(a,b),3)+'  ·  '+C[lang].dot+': '+fmt(dot(a,b),3);
    const dialogue=d=>esc(C[lang].meName+': '+d.text[lang][0]+' / '+personName(d.person)+': '+d.text[lang][1]);
    q('lab-four-quotes').innerHTML=`<p class="lab-copy">u · ${dialogue(find(S.first))}</p><p class="lab-copy" style="margin-top:10px">v · ${dialogue(find(S.second))}</p>`;
  }
  const shades=['#0a0a0a','#525252','#818181','#a3a3a3','#686868','#929292'];
  // A display offset, never an input to PCA, k-means or neighbour calculations.
  // Group coordinates only within floating-point tolerance, then spread each
  // coincident group on a small ring with at least 28px between button centres.
  function coincidentOffsets(coords) {
    const offsets=coords.map(()=>({x:0,y:0,count:1})),groups=new Map();
    coords.forEach((p,i)=>{
      if(!p)return;
      const key=p.map(x=>Math.round(x*1e9)).join('|');
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(i);
    });
    groups.forEach(indices=>{
      if(indices.length<2)return;
      const radius=Math.max(14,14/Math.sin(Math.PI/indices.length));
      indices.forEach((index,j)=>{
        const angle=2*Math.PI*j/indices.length-Math.PI/2;
        offsets[index]={x:Math.cos(angle)*radius,y:Math.sin(angle)*radius,count:indices.length};
      });
    });
    return offsets;
  }
  function updateText() {
    const c=C[lang],selected=find(S.selected),vectors=(S.mode==='embedding'&&window.MathAirEmbeddings?DATA.map(d=>window.MathAirEmbeddings[lang][S.unit][d.id]):S.mode==='semantic'?DATA.map(d=>feature(d)):wordVectors()).map(normalize);
    const selectedIndex=DATA.indexOf(selected),v=vectors[selectedIndex];
    q('lab-source').textContent=text(selected);
    q('lab-representation-note').textContent=S.mode==='embedding'?c.embeddingNote:S.mode==='semantic'?c.semanticNote:c.tokenNote;
    q('lab-feature-title').textContent=S.mode==='embedding'?c.embeddingFeatures:S.mode==='semantic'?c.topics:c.tokens;
    q('lab-features').innerHTML=S.mode==='embedding'?'<div class="lab-tokens">'+v.slice(0,8).map((x,i)=>'<span class="lab-token">x'+(i+1)+' = '+fmt(x,3)+'</span>').join('')+'</div>':S.mode==='semantic'?coordinates(feature(selected)):`<div class="lab-tokens">${lemmas(text(selected)).map(t=>'<span class="lab-token">'+esc(t)+'</span>').join('')}</div>`;
    if(length(v)<1e-12)q('lab-neighbors').innerHTML=`<li class="lab-empty">${c.noDirection}</li>`;
    else {
      const neighbors=DATA.map((d,i)=>({d,score:i===selectedIndex?null:cosine(v,vectors[i])})).filter(o=>o.score!==null).sort((a,b)=>b.score-a.score||a.d.id.localeCompare(b.d.id));
      const allZero=S.mode==='lexical'&&neighbors.length>0&&neighbors.every(o=>Math.abs(o.score)<1e-12);
      q('lab-neighbors').innerHTML=(allZero?`<li class="lab-note" role="note">${c.zeroNeighbors}</li>`:'')+neighbors.slice(0,5).map(o=>`<li><button type="button" class="lab-neighbor" data-neighbor="${o.d.id}"><span>${o.d.id} · ${esc(text(o.d))}</span><span>${fmt(o.score,3)}</span></button></li>`).join('');
    }
    const groups=kmeans(vectors,S.k),projection=pca(vectors),visible=projection.coords.filter(Boolean);
    const offsets=coincidentOffsets(projection.coords),hasOverlap=offsets.some(o=>o.count>1);
    const maxX=Math.max(.01,...visible.map(p=>Math.abs(p[0]))),maxY=Math.max(.01,...visible.map(p=>Math.abs(p[1])));
    q('lab-scatter').innerHTML=visible.length<2?`<p class="lab-empty">${c.noProjection}</p>`:DATA.map((d,i)=>{
      const p=projection.coords[i];if(!p)return '';
      const group=groups.labels[i],left=50+p[0]/maxX*43,bottom=50+p[1]/maxY*41,offset=offsets[i];
      return `<button type="button" class="lab-point" data-neighbor="${d.id}" aria-pressed="${d.id===S.selected}" aria-label="${esc(d.id+'. '+text(d)+'. '+c.cluster+' '+(group+1)+(offset.count>1?'. '+c.separatedPoint:''))}" title="${esc(d.id+' · '+text(d))}" style="left:calc(${left}% + ${offset.x}px);bottom:calc(${bottom}% + ${offset.y}px);background:${shades[group%shades.length]}">${d.id}</button>`;
    }).join('');
    q('lab-pca-caption').textContent=c.projection+' · '+fmt(projection.retained*100,1)+'% '+c.variance;
    q('lab-overlap-note').hidden=!hasOverlap;q('lab-overlap-note').textContent=c.overlapNote;
    q('lab-cluster-key').innerHTML=groups.centres.map((_,i)=>`<span class="lab-cluster"><i style="background:${shades[i]}"></i>${c.cluster} ${i+1} · ${counted(groups.labels.filter(g=>g===i).length,'point')}</span>`).join('');
    q('lab-k-value').textContent=S.k;
  }
  function topicIndices(d) {
    const v=S.speaker==='both'?mean(d.vectors):d.vectors[S.speaker==='me'?0:1],max=Math.max(...v);
    if(max<1e-12)return [];
    return S.assignment==='single'?[v.indexOf(max)]:v.map((w,i)=>w>=max*.35?i:-1).filter(i=>i>=0);
  }
  function baseConversations() {return DATA.filter(d=>(S.person==='all'||d.person===S.person)&&(S.month==='all'||d.date.slice(5,7)===S.month));}
  function updateConversations() {
    const c=C[lang],base=baseConversations(),people=S.person==='all'?Object.keys(PEOPLE):[S.person];
    let visible=base;
    if(S.cell)visible=visible.filter(d=>d.person===S.cell.person&&topicIndices(d).includes(S.cell.topic));
    const cols=TOPICS[lang].map(t=>'<th scope="col">'+t+'</th>').join('');
    q('lab-matrix').innerHTML=`<caption>${c.matrixCaption}</caption><thead><tr><th scope="col">${c.person}</th>${cols}<th scope="col">${c.total}</th></tr></thead><tbody>`+people.map(person=>{
      const ds=base.filter(d=>d.person===person);
      return `<tr><th scope="row">${personName(person)}</th>`+TOPICS[lang].map((t,i)=>{
        const n=ds.filter(d=>topicIndices(d).includes(i)).length,val=S.view==='share'?(ds.length?Math.round(n/ds.length*100):0)+'%':String(n),active=S.cell&&S.cell.person===person&&S.cell.topic===i;
        return `<td><button type="button" data-cell-person="${person}" data-cell-topic="${i}" aria-pressed="${!!active}" aria-label="${esc(personName(person)+', '+t+': '+n+' / '+ds.length)}"${n?'':' disabled'}>${val}</button></td>`;
      }).join('')+`<td>${ds.length}</td></tr>`;
    }).join('')+'</tbody>';
    const unknown=base.filter(d=>topicIndices(d).length===0).length;
    q('lab-chat-summary').textContent=counted(base.length)+(unknown?' · '+unknown+' '+c.unknown:'');
    q('lab-chat-selection').textContent=S.cell?personName(S.cell.person)+' · '+topicName(S.cell.topic)+' · '+counted(visible.length):c.quotes+' · '+counted(visible.length);
    q('lab-clear-cell').hidden=!S.cell;
    q('lab-conversation-list').innerHTML=visible.length?visible.map(d=>{
      const topics=topicIndices(d);
      return `<article class="lab-conversation" id="conversation-${d.id}"><header><h4>${personName(d.person)} · ${d.id}</h4><time datetime="${d.date}">${d.date.slice(8)}.${d.date.slice(5,7)}.2026</time></header>${d.text[lang].map((message,i)=>`<p class="lab-message${(S.speaker==='me'&&i===1)||(S.speaker==='them'&&i===0)?' muted':''}"><b>${i===0?c.meName:personName(d.person)}:</b> ${esc(message)}</p>`).join('')}<p class="lab-tags">${topics.length?topics.map(topicName).join(' · '):c.noTopics}</p></article>`;
    }).join(''):`<p class="lab-empty">${c.empty}</p>`;
    q('lab-months').innerHTML=['06','07','08'].map((month,i)=>{
      const n=DATA.filter(d=>(S.person==='all'||d.person===S.person)&&d.date.slice(5,7)===month).length;
      return `<button type="button" class="lab-month" data-month="${month}" aria-pressed="${S.month===month}">${c.months[i]}<span>${counted(n)}</span></button>`;
    }).join('');
  }
  function render(nextLang) {
    lang=nextLang==='ru'?'ru':'en';const c=C[lang];
    el=q('learning-labs');if(!el)return;
    el.innerHTML=`
      <section class="learning-lab" id="vectors" aria-labelledby="vectors-title"><div class="wrap">
        <div class="section-label">&sect; 01 · ${lang==='ru'?'Представление':'Representation'}</div><h2 class="section-title" id="vectors-title">${c.route[0]}</h2>
        <p class="section-desc">${c.vectorDesc}</p>${route(0)}
        <div class="two-col">
          <div class="card"><div class="lab-kicker">u · v</div><h3 class="card-title">${c.angleTitle}</h3><p class="card-desc">${c.angleDesc}</p>
            <div class="lab-controls">
              ${range('lab-a',c.angleA,S.a,-180,180,1,'°')}${range('lab-b',c.angleB,S.b,-180,180,1,'°')}
              ${range('lab-la',c.lengthA,S.la,0,4,.1,'')}${range('lab-lb',c.lengthB,S.lb,0,4,.1,'')}
            </div><label class="lab-check"><input id="lab-normalize" type="checkbox"${S.norm?' checked':''}/><span>${c.normalize}</span></label>
            <div class="lab-presets">${c.presets.map((p,i)=>`<button type="button" data-preset="${i}">${p}</button>`).join('')}</div>
            <div class="formula">${c.formula}</div><p class="lab-copy" id="lab-vector-note"></p>
          </div>
          <div class="card"><div class="lab-kicker">${c.directions}</div><canvas class="lab-canvas" id="lab-vector-canvas" role="img" aria-label="${c.angleTitle}"></canvas><p class="lab-copy" id="lab-vector-lengths"></p><div class="lab-metrics" id="lab-vector-metrics" aria-live="polite"></div></div>
        </div>
        <div class="card" style="margin-top:24px"><div class="lab-kicker">${c.manual}</div><h3 class="card-title">${c.fourTitle}</h3><p class="card-desc">${c.fourDesc}</p>
          <div class="two-col"><div><div class="lab-controls">${select('lab-first',c.vectorFirst,options(S.first,true),true)}${select('lab-second',c.vectorSecond,options(S.second,true),true)}</div><div id="lab-four-quotes"></div></div>
          <div><div id="lab-four-coordinates"></div><div class="formula" id="lab-four-result"></div><p class="lab-copy">${c.fourNote}</p></div></div>
        </div><a class="lab-next" href="#text-space">${c.nextText}</a>
      </div></section>
      <section class="learning-lab" id="text-space" aria-labelledby="text-space-title"><div class="wrap">
        <div class="section-label">&sect; 02 · ${lang==='ru'?'От текста к числам':'From text to numbers'}</div><h2 class="section-title" id="text-space-title">${c.route[1]}</h2><p class="section-desc">${c.textDesc}</p>${route(1)}
        <div class="two-col">
          <div class="card"><h3 class="card-title">${c.textTitle}</h3><p class="card-desc">${c.textCardDesc}</p><div class="lab-controls">
            ${select('lab-text-select',c.select,options(S.selected,true),true)}
            ${select('lab-mode',c.mode,`${window.MathAirEmbeddings?'<option value="embedding"'+(S.mode==='embedding'?' selected':'')+'>'+c.embedding+'</option>':''}<option value="semantic"${S.mode==='semantic'?' selected':''}>${c.semantic}</option><option value="lexical"${S.mode==='lexical'?' selected':''}>${c.lexical}</option>`)}
            ${select('lab-unit',c.unit,`<option value="episode"${S.unit==='episode'?' selected':''}>${c.episode}</option><option value="reply"${S.unit==='reply'?' selected':''}>${c.reply}</option>`)}
          </div><div class="lab-mini-label">${c.source}</div><blockquote class="lab-source-quote" id="lab-source"></blockquote>
          <div class="lab-mini-label" id="lab-feature-title"></div><div id="lab-features"></div><p class="lab-note" id="lab-representation-note"></p>
          <h4 class="card-title" style="font-size:19px">${c.nearest}</h4><p class="lab-copy">${c.nearestDesc}</p><ol class="lab-neighbors" id="lab-neighbors"></ol><p class="lab-copy">${c.notProbability}</p>
          </div>
          <div class="card"><h3 class="card-title">${c.mapTitle}</h3><p class="card-desc">${c.mapDesc}</p>
            <div class="lab-controls">${range('lab-k',c.clusters,S.k,2,6,1,'')}</div>
            <div class="lab-scatter" id="lab-scatter" role="group" aria-label="${c.mapTitle}"></div>
            <div class="lab-map-caption"><span>${c.component2} ↑</span><span>${c.component1} →</span></div><p class="lab-copy" id="lab-pca-caption"></p><p class="lab-note" id="lab-overlap-note" hidden></p><div class="lab-clusters" id="lab-cluster-key"></div>
            <p class="lab-copy">${c.clusteringNote}</p><p class="lab-note">${c.projectionNote}</p><p class="lab-copy">${c.explanation}</p>
            <details class="lab-how"><summary>${c.how}</summary><p>${c.howText}</p><p><a href="https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2" target="_blank" rel="noopener">${c.more} ↗</a></p></details>
          </div>
        </div><a class="lab-next" href="#conversations">${c.nextChat}</a>
      </div></section>
      <section class="learning-lab" id="conversations" aria-labelledby="conversations-title"><div class="wrap">
        <div class="section-label">&sect; 03 · ${lang==='ru'?'От фрагментов к картине':'From fragments to an overview'}</div><h2 class="section-title" id="conversations-title">${c.route[2]}</h2><p class="section-desc">${c.chatDesc}</p>${route(2)}
        <div class="two-col">
          <div class="card"><h3 class="card-title">${c.chatTitle}</h3><p class="card-desc">${c.chatCardDesc}</p><div class="lab-controls">
            ${select('lab-person',c.person,`<option value="all">${c.allPeople}</option>`+Object.keys(PEOPLE).map(p=>`<option value="${p}"${S.person===p?' selected':''}>${personName(p)}</option>`).join(''))}
            ${select('lab-month',c.period,`<option value="all">${c.allMonths}</option>`+['06','07','08'].map((m,i)=>`<option value="${m}"${S.month===m?' selected':''}>${c.months[i]} 2026</option>`).join(''))}
            ${select('lab-speaker',c.speaker,`<option value="both"${S.speaker==='both'?' selected':''}>${c.both}</option><option value="me"${S.speaker==='me'?' selected':''}>${c.me}</option><option value="them"${S.speaker==='them'?' selected':''}>${c.them}</option>`)}
            ${select('lab-assignment',c.assignment,`<option value="multi"${S.assignment==='multi'?' selected':''}>${c.multi}</option><option value="single"${S.assignment==='single'?' selected':''}>${c.single}</option>`)}
          </div><div class="lab-segment" aria-label="${c.count+' / '+c.share}"><button type="button" data-view="count" aria-pressed="${S.view==='count'}">${c.count}</button><button type="button" data-view="share" aria-pressed="${S.view==='share'}">${c.share}</button></div>
          <div class="lab-scroll"><table class="lab-table" id="lab-matrix"></table></div><p class="lab-copy" id="lab-chat-summary" aria-live="polite"></p><div class="lab-timeline" id="lab-months"></div><p class="lab-note">${c.chatNote}</p>
          <details class="lab-how"><summary>${c.topicRule}</summary><p>${c.topicRuleText}</p></details>
          </div>
          <div class="card"><div class="lab-selection"><h3 class="card-title" style="font-size:19px;margin:0" id="lab-chat-selection"></h3><button type="button" class="lab-clear" id="lab-clear-cell" hidden>${c.clear}</button></div><div class="lab-conversation-list" id="lab-conversation-list" tabindex="0" role="region" aria-label="${c.quotes}"></div></div>
        </div><p class="lab-note">${c.fixture}</p><p class="lab-copy">${c.endNote}</p><a class="lab-next" href="#vectors">${c.back}</a>
      </div></section>`;
    bind();updateVectors();updateFour();updateText();updateConversations();
    if(canvasObserver)canvasObserver.disconnect();
    if(window.ResizeObserver){canvasObserver=new ResizeObserver(()=>drawVectors(angleResults()));canvasObserver.observe(q('lab-vector-canvas'));}
  }
  function bind() {
    ['a','b','la','lb'].forEach(key=>q('lab-'+key).addEventListener('input',e=>{S[key]=Number(e.target.value);updateVectors();}));
    q('lab-normalize').addEventListener('change',e=>{S.norm=e.target.checked;updateVectors();});
    q('lab-first').addEventListener('change',e=>{S.first=e.target.value;updateFour();});
    q('lab-second').addEventListener('change',e=>{S.second=e.target.value;updateFour();});
    q('lab-text-select').addEventListener('change',e=>{S.selected=e.target.value;updateText();});
    q('lab-mode').addEventListener('change',e=>{S.mode=e.target.value;updateText();});
    q('lab-unit').addEventListener('change',e=>{S.unit=e.target.value;updateText();});
    q('lab-k').addEventListener('input',e=>{S.k=Number(e.target.value);q('lab-k-value').textContent=S.k;updateText();});
    ['person','month','speaker','assignment'].forEach(key=>q('lab-'+key).addEventListener('change',e=>{S[key]=e.target.value;S.cell=null;updateConversations();}));
    q('lab-clear-cell').addEventListener('click',()=>{S.cell=null;updateConversations();});
    el.addEventListener('click',handleClick);
  }
  function handleClick(e) {
    const button=e.target.closest('button');if(!button)return;
    if(button.dataset.preset!==undefined){
      const p=Number(button.dataset.preset);S.a=20;S.b=[20,110,-160,70][p];S.la=2;S.lb=p===3?0:3;
      ['a','b','la','lb'].forEach(k=>{q('lab-'+k).value=S[k];});updateVectors();
    }
    if(button.dataset.neighbor){const wasPoint=button.classList.contains('lab-point');S.selected=button.dataset.neighbor;q('lab-text-select').value=S.selected;updateText();const next=wasPoint?q('lab-scatter').querySelector('[data-neighbor="'+S.selected+'"]'):q('lab-text-select');if(next)next.focus({preventScroll:true});}
    if(button.dataset.cellPerson){S.cell={person:button.dataset.cellPerson,topic:Number(button.dataset.cellTopic)};updateConversations();q('lab-conversation-list').scrollTop=0;const next=q('lab-matrix').querySelector('[data-cell-person="'+S.cell.person+'"][data-cell-topic="'+S.cell.topic+'"]');if(next)next.focus({preventScroll:true});}
    if(button.dataset.month){const selectedMonth=button.dataset.month;S.month=S.month===selectedMonth?'all':selectedMonth;q('lab-month').value=S.month;S.cell=null;updateConversations();const next=q('lab-months').querySelector('[data-month="'+selectedMonth+'"]');if(next)next.focus({preventScroll:true});}
    if(button.dataset.view){S.view=button.dataset.view;el.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===S.view)));updateConversations();}
  }
  // Useful for small numerical checks without coupling them to page layout.
  window.MathAirLabs={render,math:{dot,length,normalize,cosine,kmeans,pca},display:{coincidentOffsets,counted},data:DATA};
  render(document.documentElement.lang);
})();
