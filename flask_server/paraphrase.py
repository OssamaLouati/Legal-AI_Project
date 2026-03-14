"""Paraphrasing helper.

Original file contained Kaggle notebook scaffolding and eagerly downloaded/loaded
the T5 model at import-time.

In a web server this is problematic because importing the module blocks startup
(large model download) or can crash on restricted environments.

We lazy-load the model on first use.
"""

from __future__ import annotations

from functools import lru_cache

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


@lru_cache(maxsize=1)
def _get_model():
    device = "cpu"
    tokenizer = AutoTokenizer.from_pretrained("humarin/chatgpt_paraphraser_on_T5_base")
    model = AutoModelForSeq2SeqLM.from_pretrained("humarin/chatgpt_paraphraser_on_T5_base").to(device)
    return tokenizer, model

def paraphrase(
    question,
    num_beams=5,
    num_beam_groups=5,
    num_return_sequences=5,
    repetition_penalty=10.0,
    diversity_penalty=3.0,
    no_repeat_ngram_size=2,
    temperature=0.7,
    max_length=128
):
    tokenizer, model = _get_model()
    input_ids = tokenizer(
        f'paraphrase: {question}',
        return_tensors="pt", padding="longest",
        max_length=max_length,
        truncation=True,
    ).input_ids
    
    outputs = model.generate(
        input_ids, temperature=temperature, repetition_penalty=repetition_penalty,
        num_return_sequences=num_return_sequences, no_repeat_ngram_size=no_repeat_ngram_size,
        num_beams=num_beams, num_beam_groups=num_beam_groups,
        max_length=max_length, diversity_penalty=diversity_penalty
    )

    res = tokenizer.batch_decode(outputs, skip_special_tokens=True)

    return res