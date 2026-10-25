#!/usr/bin/env python3
"""Precompute the fictional corpus with FastEmbed; the website needs no model server.

Install fastembed==0.9.1 in a temporary environment, then run this script.
Model weights are downloaded only for this authoring step and are not published.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
from fastembed import TextEmbedding

ROOT = Path(__file__).resolve().parents[1]
MODEL = 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cache-dir', default=None)
    args = parser.parse_args()
    source = ROOT / 'conversation-corpus.json'
    corpus = json.loads(source.read_text())
    model = TextEmbedding(MODEL, cache_dir=args.cache_dir, threads=2)
    result = {
        'model': MODEL,
        'modelUrl': 'https://huggingface.co/' + MODEL,
        'runtime': 'FastEmbed 0.9.1; Qdrant quantized ONNX model',
        'modelRepository': 'Qdrant/paraphrase-multilingual-MiniLM-L12-v2-onnx-Q',
        'license': 'Apache-2.0',
        'dimensions': 384,
        'corpusSHA256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'pooling': 'attention-mask mean pooling; L2 normalization',
        'episodeInput': 'the two messages joined with one space',
        'replyInput': 'the second message alone',
        'precision': 'rounded to 7 decimal places',
    }
    for lang in ['ru', 'en']:
        result[lang] = {}
        for unit in ['episode', 'reply']:
            texts = [(' '.join(d['text'][lang]) if unit == 'episode' else d['text'][lang][1]) for d in corpus]
            vectors = list(model.embed(texts, batch_size=24))
            result[lang][unit] = {}
            for d, vector in zip(corpus, vectors):
                norm = math.sqrt(sum(float(v) ** 2 for v in vector))
                result[lang][unit][d['id']] = [round(float(v) / norm, 7) for v in vector]
    (ROOT / 'embeddings-data.js').write_text(
        '// Precomputed from fictional messages. See scripts/generate-embeddings.py.\n'
        'window.MathAirEmbeddings=' + json.dumps(result, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('Saved 96 multilingual 384-dimensional vectors to embeddings-data.js')


if __name__ == '__main__':
    main()
