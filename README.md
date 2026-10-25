# Math Air

A buildless visual mathematics page. Open through a static HTTP server; there is no installation or build step.

## Learning sequence

1. **Vectors & similarity** — two arrows, cosine and dot product, unit normalization, zero-vector edge case, then four named coordinates.
2. **Text as space** — the same fictional fragments represented by lemma TF–IDF, four manually annotated topic weights, or precomputed neural embeddings. Cosine neighbours, k-means and a two-component PCA projection are computed in the browser.
3. **Conversation map** — a contact/topic matrix with month, speaker, one/multiple-topic and count/share controls. Every cell opens the source conversations.

The original statistics, equations and regression labs remain below this sequence.

## Files

- `index.html`: the original labs, navigation and language switch.
- `learning-labs.css`: responsive styling using the existing page tokens.
- `learning-labs.js`: bilingual lab UI, fictional corpus, small example lemmatization dictionary and numerical methods.
- `conversation-corpus.json`: a readable export of the 24 fictional dialogues (48 messages) in Russian and English.
- `embeddings-data.js`: precomputed embeddings; see its model/provenance metadata. It must load before `learning-labs.js`.

No user text is uploaded. No model inference or external API request is needed to use the labs. The only external page assets are the existing Google Fonts. The neural representation uses precomputed numbers; the four named topic coordinates and the conversation-map topic annotations are explicitly manual. The lemmatizer is a small dictionary for this corpus, not a production morphological analyser.

The model card is at https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 .

## Numerical checks

Run `node check-labs.cjs`. The checks cover known cosine values, normalization invariants, zero-vector handling, simple k-means groups, preservation of distances when PCA retains all nonzero dimensions, corpus integrity, embedding dimensions when the data file is present, and script syntax.

PCA is for display. Neighbours and k-means are calculated in the full selected feature space. Zero vectors are excluded from cosine comparison, clustering and PCA. Topic shares in the conversation map use all fragments for the selected contact and period as the denominator; multiple-topic shares can sum to more than 100%.
