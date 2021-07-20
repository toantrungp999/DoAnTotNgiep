# -*- coding: utf-8 -*-

import regex as re
import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer

from tensorflow.keras.models import load_model

import re

from flask import Flask, request, jsonify

app = Flask(__name__)


MEN_T_SHIRT_SIZE_S = "Theo chiều cao, cân nặng: Chều cao(cm): 150 - 160, cân nặng(kg): 42 - 49 \r\nTheo vòng đo cơ thể: Dài thân: 66, Ngang ngực: 48, Rộng vai: 40"
WOMEN_T_SHIRT_SIZE_S = "Theo chiều cao, cân nặng: Chều cao(cm): dưới 150, cân nặng(kg): 35 - 40 \r\nTheo vòng đo cơ thể: Dài áo: 59, Bụng/ngực: 41, Vai: 35"
MEN_SHIRT_SIZE_S = "Theo chiều cao, cân nặng: Chều cao(cm): 160 - 165, cân nặng(kg): 55 - 60 \r\n Theo vòng đo cơ thể: Vòng cổ: 38-39, Vòng bụng: 69-77, Vòng ngực: 81-90"
WOMEN_SHIRT_SIZE_S = "Theo chiều cao, cân nặng: Chều cao(cm): 148 - 153, cân nặng(kg): 38 - 43 \r\nTheo vòng đo cơ thể: Dài áo: 62, Vai: 36, Dài tay:18, Ngực: 88, Cổ: 35"

MEN_T_SHIRT_SIZE_M = "Theo chiều cao, cân nặng: Chều cao(cm): 160 - 167, cân nặng(kg): 50 - 55 \r\nTheo vòng đo cơ thể: Dài thân: 70, Ngang ngực: 50, Rộng vai: 42"
WOMEN_T_SHIRT_SIZE_M = "Theo chiều cao, cân nặng: Chều cao(cm): dưới 150 - 170, cân nặng(kg): 35 - 60 \r\nTheo vòng đo cơ thể: Dài áo: 60, Bụng/ngực: 43, Vai: 36"
MEN_SHIRT_SIZE_M = "Theo chiều cao, cân nặng: Chều cao(cm): 166 - 169, cân nặng(kg): 60 - 65 \r\nTheo vòng đo cơ thể: Vòng cổ: 40-41, Vòng bụng: 78-83, Vòng ngực: 91-105"
WOMEN_SHIRT_SIZE_M = "Theo chiều cao, cân nặng: Chều cao(cm): 153 - 155, cân nặng(kg): 43 - 46 \r\nTheo vòng đo cơ thể: Dài áo: 64, Vai: 37, Dài tay:19, Ngực: 92, Cổ: 36"

MEN_T_SHIRT_SIZE_L = "Theo chiều cao, cân nặng: Chều cao(cm): 167 - 170, cân nặng(kg): 56 - 65 \r\nTheo vòng đo cơ thể: Dài thân: 72, Ngang ngực: 52, Rộng vai: 44"
WOMEN_T_SHIRT_SIZE_L = "Theo chiều cao, cân nặng: Chều cao(cm): 150 - trên 170, cân nặng(kg): 35 - 60 \r\nTheo vòng đo cơ thể: Dài áo: 62, Bụng/ngực: 45, Vai: 37"
MEN_SHIRT_SIZE_L = "Theo chiều cao, cân nặng: Chều cao(cm): 170 - 174, cân nặng(kg): 66 - 70 \r\nTheo vòng đo cơ thể: Vòng cổ: 42-43, Vòng bụng: 83-89, Vòng ngực: 106-116"
WOMEN_SHIRT_SIZE_L = "Theo chiều cao, cân nặng: Chều cao(cm): 155 - 158, cân nặng(kg): 46 - 53 \r\nTheo vòng đo cơ thể: Dài áo: 65, Vai: 38, Dài tay:20, Ngực: 96, Cổ: 37"


MEN_T_SHIRT_SIZE_XL = "Theo chiều cao, cân nặng: Chều cao(cm): 170 - 175, cân nặng(kg): 66 - 71 \r\nTheo vòng đo cơ thể: Dài thân: 73, Ngang ngực: 54, Rộng vai: 46"
WOMEN_T_SHIRT_SIZE_XL = "Theo chiều cao, cân nặng: Chều cao(cm): 150 - trên 170, cân nặng(kg): 35 - 60 \r\nTheo vòng đo cơ thể: Dài áo: 64, Bụng/ngực: 47, Vai: 38"
MEN_SHIRT_SIZE_XL = "Theo chiều cao, cân nặng: Chều cao(cm): 175 - 176, cân nặng(kg): 70 - 76 \r\nTheo vòng đo cơ thể: Vòng cổ: 44-45, Vòng bụng: 90-97, Vòng ngực: 117-128"
WOMEN_SHIRT_SIZE_XL = "Theo chiều cao, cân nặng: Chều cao(cm): 158 - 162cm, cân nặng(kg): 53-57 \r\nTheo vòng đo cơ thể: Dài áo: 66, Vai: 39, Dài tay:20, Ngực: 100, Cổ: 38"

MEN_T_SHIRT_SIZE_XXL = "Theo chiều cao, cân nặng: Chều cao(cm): 175 - 180, cân nặng(kg): 72 - 76 \r\nTheo vòng đo cơ thể: Dài thân: 75, Ngang ngực: 56, Rộng vai: 48"
WOMEN_T_SHIRT_SIZE_XXL = "Theo chiều cao, cân nặng: Chều cao(cm): 150 - trên 170, cân nặng(kg): trên 60 \r\nTheo vòng đo cơ thể: Dài áo: 66, Bụng/ngực: 49, Vai: 39"
MEN_SHIRT_SIZE_XXL = "Theo chiều cao, cân nặng: Chều cao(cm): 175 - 177, cân nặng(kg): 76 - 80"
WOMEN_SHIRT_SIZE_XXL = "Theo chiều cao, cân nặng: Chều cao(cm): 155 - 166, cân nặng(kg): 57 - 66 \r\n - Theo vòng đo cơ thể: Dài áo: 67, Vai: 41, Dài tay:21, Ngực: 104, Cổ: 39"

PANTS_SIZE_28 = "Chều cao(cm): 160 - 165, cân nặng(kg): 50 - 52.5"
PANTS_SIZE_29 = "Chều cao(cm): 160 - 175, cân nặng(kg): 52.5 - 57.5"
PANTS_SIZE_30 = "Chều cao(cm): 160 - 175, cân nặng(kg): 55 - 62.5"
PANTS_SIZE_31 = "Chều cao(cm): 160 - 180, cân nặng(kg): 60 - 67.5"
PANTS_SIZE_32 = "Chều cao(cm): 160 - 180, cân nặng(kg): 65 - 70"
PANTS_SIZE_33 = "Chều cao(cm): 160 - 180, cân nặng(kg): 72.5 - 75"


def no_accent_vietnamese(s):
    s = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', s)
    s = re.sub(r'[ÀÁẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪ]', 'A', s)
    s = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', s)
    s = re.sub(r'[ÈÉẸẺẼÊỀẾỆỂỄ]', 'E', s)
    s = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', s)
    s = re.sub(r'[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]', 'O', s)
    s = re.sub(r'[ìíịỉĩ]', 'i', s)
    s = re.sub(r'[ÌÍỊỈĨ]', 'I', s)
    s = re.sub(r'[ùúụủũưừứựửữ]', 'u', s)
    s = re.sub(r'[ƯỪỨỰỬỮÙÚỤỦŨ]', 'U', s)
    s = re.sub(r'[ỳýỵỷỹ]', 'y', s)
    s = re.sub(r'[ỲÝỴỶỸ]', 'Y', s)
    s = re.sub(r'[Đ]', 'D', s)
    s = re.sub(r'[đ]', 'd', s)
    return s


lemmatizer = WordNetLemmatizer()
intents = json.loads(open('intents.json', encoding='utf-8').read())

words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('chatbotmodel.h5')


# color_size_intents = json.loads(open('color_size.json').read())
# color_size_words = pickle.load(open('color_size_words.pkl', 'rb'))
# color_size_classes = pickle.load(open('color_size_classes.pkl', 'rb'))
# color_size_model = load_model('color_size_model.h5')


def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words


def bag_of_word(words, sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)


def predict_class(model, classes, words, sentence):
    bow = bag_of_word(words, sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]

    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    return return_list


def get_response(intents_list, intents_json):
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            return random.choice(i['responses'])
    return ""


def remove_html(txt):
    return re.sub(r'<[^>]*>', '', txt)


def convert_keywords_to_english(text):
    text = text.replace("màu sắc", "color")
    text = text.replace("màu", "color")
    text = text.replace("kích cở", "size")
    text = text.replace("cở", "size")
    text = text.replace("mau sac", "color")
    text = text.replace("mau", "color")
    text = text.replace("kich co", "size")
    text = text.replace("hãng", "brand")
    text = text.replace("thương hiệu", "brand")
    text = text.replace("thuong hieu", "brand")
    text = text.replace("có tên", "has name")
    text = text.replace("tên", "has name")
    text = text.replace("ten", "has name")

    text = text.replace("của", "")
    text = text.replace("cua", "")
    return text


def check_is_search_size(text):
    if "ao thun nam size s" in text or "size s ao thun nam" in text:
        return MEN_T_SHIRT_SIZE_S
    elif "ao thun nam size m" in text or "size m ao thun nam" in text:
        return MEN_T_SHIRT_SIZE_M
    elif "ao thun nam size l" in text or "size l ao thun nam" in text:
        return MEN_T_SHIRT_SIZE_L
    elif "ao thun nam size xl" in text or "size xl ao thun nam" in text:
        return MEN_T_SHIRT_SIZE_XL
    elif "ao thun nam size xxl" in text or "size xxl ao thun nam" in text:
        return MEN_T_SHIRT_SIZE_XXL
    # elif "size ao thun nam" in text:
    #     return " - S:\r\n" + MEN_T_SHIRT_SIZE_S + "\r\n - M:\r\n" + MEN_T_SHIRT_SIZE_M + "\r\n - L:\r\n" + MEN_T_SHIRT_SIZE_L + "\r\n - XL:\r\n" + MEN_T_SHIRT_SIZE_XL + "\r\n - XXL:\r\n" + MEN_T_SHIRT_SIZE_XXL
    elif "ao thun nu size s" in text or "size s ao thun nu" in text:
        return WOMEN_T_SHIRT_SIZE_S
    elif "ao thun nu size m" in text or "size m ao thun nu" in text:
        return WOMEN_T_SHIRT_SIZE_M
    elif "ao thun nu size l" in text or "size m ao thun nu" in text:
        return WOMEN_T_SHIRT_SIZE_L
    elif "ao thun nu size xl" in text or "size xl ao thun nu" in text:
        return WOMEN_T_SHIRT_SIZE_XL
    elif "ao thun nu size xxl" in text or "size xxl ao thun nu" in text:
        return WOMEN_T_SHIRT_SIZE_XXL
    # elif "size ao thun nu" in text:
    #     return " - S:\r\n" + WOMEN_T_SHIRT_SIZE_S + "\r\n - M:\r\n" + WOMEN_T_SHIRT_SIZE_M + "\r\n - L:\r\n" + WOMEN_T_SHIRT_SIZE_L + "\r\n - XL:\r\n" + WOMEN_T_SHIRT_SIZE_XL + "\r\n - XXL:\r\n" + WOMEN_T_SHIRT_SIZE_XXL
    elif "ao so mi nam size s" in text or "size s ao so mi nam" in text:
        return MEN_SHIRT_SIZE_S
    elif "ao so mi nam size m" in text or "size m ao so mi nam" in text:
        return MEN_SHIRT_SIZE_M
    elif "ao so mi nam size l" in text or "size l ao so mi nam" in text:
        return MEN_SHIRT_SIZE_L
    elif "ao so mi nam size xl" in text or "size xl ao so mi nam" in text:
        return MEN_SHIRT_SIZE_XL
    elif "ao so mi nam size xxl" in text or "size xxl ao so mi nam" in text:
        return MEN_SHIRT_SIZE_XXL
    # elif "size ao so mi nam" in text:
    #     return " - S:\r\n" + MEN_SHIRT_SIZE_S + "\r\n - M:\r\n" + MEN_SHIRT_SIZE_M + "\r\n - L:\r\n" + MEN_SHIRT_SIZE_L + "\r\n - XL:\r\n" + MEN_SHIRT_SIZE_XL + "\r\n - XXL:\r\n" + MEN_SHIRT_SIZE_XXL
    elif "ao so mi nu size s" in text or "size s ao so mi nu" in text:
        return WOMEN_SHIRT_SIZE_S
    elif "ao so mi nu size m" in text or "size m ao so mi nu" in text:
        return WOMEN_SHIRT_SIZE_M
    elif "ao so mi nu size l" in text or "size l ao so mi nu" in text:
        return WOMEN_SHIRT_SIZE_L
    elif "ao so mi nu size xl" in text or "size xl ao so mi nu" in text:
        return WOMEN_SHIRT_SIZE_XL
    elif "ao so mi nu size xxl" in text or "size xxl ao so mi nu" in text:
        return WOMEN_SHIRT_SIZE_XXL
    # elif "size ao so mi nu" in text:
    #     return " - S:\r\n" + WOMEN_SHIRT_SIZE_S + "\r\n - M:\r\n" + WOMEN_SHIRT_SIZE_M + "\r\n - L:\r\n" + WOMEN_SHIRT_SIZE_L + "\r\n - XL:\r\n" + WOMEN_SHIRT_SIZE_XL + "\r\n - XXL:\r\n" + WOMEN_SHIRT_SIZE_XXL
    # elif "size ao so mi" in text:
    #     return " - Nam\r\n + S:\r\n" + MEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_SHIRT_SIZE_XXL + " \r\n - Nữ \r\n + S:\r\n" + WOMEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_SHIRT_SIZE_XXL
    # elif "size ao thun" in text:
    #     return " - Nam\r\n + S:\r\n" + MEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_T_SHIRT_SIZE_XXL + " \r\n - Nữ \r\n + S:\r\n" + WOMEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_T_SHIRT_SIZE_XXL
    # elif "size ao nam" in text:
    #     return " - Áo thun\r\n + S:\r\n" + MEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_T_SHIRT_SIZE_XXL + "\r\n - Áo sơ mi:\r\n + S:\r\n" + MEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_SHIRT_SIZE_XXL
    # elif "size ao nu" in text:
    #     return " - Áo thun\r\n + S:\r\n" + WOMEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_T_SHIRT_SIZE_XXL + "\r\n - Áo sơ mi:\r\n + S:\r\n" + WOMEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_SHIRT_SIZE_XXL
    elif "cac loai size ao" in text or text == "size ao":
        return "Nam\r\n - Áo thun\r\n + S:\r\n" + MEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_T_SHIRT_SIZE_XXL + "\r\n - Áo sơ mi:\r\n + S:\r\n" + MEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_SHIRT_SIZE_XXL + "\r\nNữ\r\n - Áo thun\r\n + S:\r\n" + WOMEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_T_SHIRT_SIZE_XXL + "\r\n - Áo sơ mi:\r\n + S:\r\n" + WOMEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_SHIRT_SIZE_XXL
    elif "quan nam size" in text or "quan nu size" in text or "quan size" in text:
        if "size 28" in text:
            return PANTS_SIZE_28
        elif "size 29" in text:
            return PANTS_SIZE_29
        elif "size 30" in text:
            return PANTS_SIZE_30
        elif "size 31" in text:
            return PANTS_SIZE_31
        elif "size 32" in text:
            return PANTS_SIZE_32
        elif "size 33" in text:
            return PANTS_SIZE_33
    elif "cac loai size quan" in text or text == "size quan":
        return " - Size 28:\r\n"+PANTS_SIZE_28+"\r\n - Size 30:\r\n"+PANTS_SIZE_29+"\r\n - Size 30:\r\n"+PANTS_SIZE_30
    return ""


print("Go! Bot is running")


uniChars = "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÂĂĐÔƠƯ"
unsignChars = "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEDIIIOOOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYAADOOU"


def loaddicchar():
    dic = {}
    char1252 = 'à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ'.split(
        '|')
    charutf8 = "à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ".split(
        '|')
    for i in range(len(char1252)):
        dic[char1252[i]] = charutf8[i]
    return dic


dicchar = loaddicchar()

# Đưa toàn bộ dữ liệu qua hàm này để chuẩn hóa lại


def covert_unicode(txt):
    return re.sub(
        r'à|á|ả|ã|ạ|ầ|ấ|ẩ|ẫ|ậ|ằ|ắ|ẳ|ẵ|ặ|è|é|ẻ|ẽ|ẹ|ề|ế|ể|ễ|ệ|ì|í|ỉ|ĩ|ị|ò|ó|ỏ|õ|ọ|ồ|ố|ổ|ỗ|ộ|ờ|ớ|ở|ỡ|ợ|ù|ú|ủ|ũ|ụ|ừ|ứ|ử|ữ|ự|ỳ|ý|ỷ|ỹ|ỵ|À|Á|Ả|Ã|Ạ|Ầ|Ấ|Ẩ|Ẫ|Ậ|Ằ|Ắ|Ẳ|Ẵ|Ặ|È|É|Ẻ|Ẽ|Ẹ|Ề|Ế|Ể|Ễ|Ệ|Ì|Í|Ỉ|Ĩ|Ị|Ò|Ó|Ỏ|Õ|Ọ|Ồ|Ố|Ổ|Ỗ|Ộ|Ờ|Ớ|Ở|Ỡ|Ợ|Ù|Ú|Ủ|Ũ|Ụ|Ừ|Ứ|Ử|Ữ|Ự|Ỳ|Ý|Ỷ|Ỹ|Ỵ',
        lambda x: dicchar[x.group()], txt)


def get_word_behind_word(text, word):
    index = text.index(word)+len(word)+1
    total = len(text)
    result = ""
    while index < total and text[index] != ' ':
        result += text[index]
        index += 1
    return result


def detect_man_t_shirt_size(tall, heavy):
    if tall >= 150 and tall <= 160 and heavy >= 42 and heavy <= 49:
        return "S"
    elif tall >= 160 and tall <= 167 and heavy >= 50 and heavy <= 55:
        return "M"
    elif tall >= 167 and tall <= 170 and heavy >= 56 and heavy <= 65:
        return "L"
    elif tall >= 170 and tall <= 175 and heavy >= 66 and heavy <= 71:
        return "XL"
    elif tall >= 175 and tall <= 180 and heavy >= 72 and heavy <= 76:
        return "XXL"
    return "NOT_FOUND"


def detect_man_shirt_size(tall, heavy):
    if tall >= 160 and tall <= 165 and heavy >= 55 and heavy <= 60:
        return "S"
    elif tall >= 166 and tall <= 169 and heavy >= 60 and heavy <= 65:
        return "M"
    elif tall >= 170 and tall <= 174 and heavy >= 66 and heavy <= 70:
        return "L"
    elif tall >= 175 and tall <= 176 and heavy >= 70 and heavy <= 76:
        return "XL"
    elif tall >= 175 and tall <= 177 and heavy >= 76 and heavy <= 80:
        return "XXL"
    return "NOT_FOUND"


def detect_woman_t_shirt_size(tall, heavy):
    if tall <= 150:
        if heavy <= 40:
            return "S"
        elif heavy >= 50 and heavy <= 40:
            return "S, M"
        elif heavy >= 50 and heavy <= 60:
            return "M"
        else:
            return "L"
    elif tall >= 150 and tall <= 160:
        if heavy <= 40:
            return "M"
        elif heavy >= 40 and heavy <= 50:
            return "M, L"
        elif heavy >= 50 and heavy <= 60:
            return "L"
        else:
            return "L, XL"
    elif tall >= 160 and tall <= 170:
        if heavy <= 40:
            return "M"
        elif heavy >= 40 and heavy <= 50:
            return "L, XL"
        elif heavy >= 50 and heavy <= 60:
            return "L, XL"
        else:
            return "XL"
    elif tall >= 170:
        if heavy <= 40:
            return "L"
        elif heavy >= 40 and heavy < 50:
            return "XL"
        elif heavy >= 50 and heavy <= 60:
            return "XL"
        else:
            return "XXL"
    return "NOT_FOUND"


def detect_woman_shirt_size(tall, heavy):
    if tall >= 148 and tall <= 153 and heavy >= 38 and heavy < 43:
        return "S"
    elif tall >= 153 and tall <= 155 and heavy >= 43 and heavy <= 46:
        return "M"
    elif tall >= 155 and tall <= 158 and heavy >= 46 and heavy <= 53:
        return "L"
    elif tall >= 158 and tall <= 162 and heavy >= 53 and heavy <= 57:
        return "XL"
    elif tall >= 162 and tall <= 177 and heavy >= 57 and heavy <= 66:
        return "XXL"
    return "NOT_FOUND"


def detact_man_pants_size(tall, heavy):
    if heavy >= 52.5 and heavy <= 57.5 and tall >= 160 and tall <= 175:
        return "29"
    elif heavy >= 60 and heavy <= 62.5 and tall >= 160 and tall <= 175:
        return "30"
    elif heavy >= 62.5 and heavy <= 67.5 and tall >= 160 and tall <= 180:
        return "31"
    elif heavy >= 67.5 and heavy <= 70 and tall >= 160 and tall <= 180:
        return "32"
    elif heavy >= 72.5 and heavy <= 75 and tall >= 165 and tall <= 180:
        return "33"
    return "NOT_FOUND"


def detact_woman_pants_size(tall, heavy):
    if heavy >= 38 and heavy <= 44 and tall >= 146 and tall <= 149:
        return "26"
    elif heavy >= 44 and heavy <= 49 and tall >= 149 and tall <= 152:
        return "27"
    elif heavy >= 49 and heavy <= 54 and tall >= 152 and tall <= 155:
        return "28"
    elif heavy >= 53 and heavy <= 59 and tall >= 155 and tall <= 158:
        return "29"
    elif heavy >= 59 and heavy <= 62 and tall >= 158 and tall <= 161:
        return "30"
    elif heavy >= 62 and heavy <= 64 and tall >= 161 and tall <= 162:
        return "31"
    elif heavy >= 64 and heavy <= 67 and tall >= 164 and tall <= 167:
        return "32"
    return "NOT_FOUND"


def detect_size(type, message):
    message = message.replace(" la ", " ")
    heavy = ""
    tall = ""
    if "nang" in message:
        heavy = get_word_behind_word(message, "nang")
    elif "luong" in message:
        heavy = get_word_behind_word(message, "luong")

    heavy = heavy.replace("kg", "")
    heavy = heavy.replace(",", ".")
    print(heavy)
    if "cao" in message:
        tall = get_word_behind_word(message, "cao")
    tall = tall.replace("cm", "")
    tall = tall.replace("m", "")
    tall = tall.replace(",", ".")
    print(tall)
    tall = float(tall)
    heavy = float(heavy)
    print(type)
    print(heavy)
    print(tall)
    if tall <= 25:
        tall *= 10

    if type == "ask_about_size_t_shirt":
        sizeMan = detect_man_t_shirt_size(tall, heavy)
        sizeWoman = detect_woman_t_shirt_size(tall, heavy)
        if sizeMan == "NOT_FOUND" or sizeWoman == "NOT_FOUND":
            return "Không tìm thấy size phù hợp bạn tham khảo thông tin dưới đây: \r\n Nam\r\n - Áo thun\r\n + S:\r\n" + MEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_T_SHIRT_SIZE_XXL + "\r\n - Áo sơ mi:\r\n + S:\r\n" + MEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_SHIRT_SIZE_XXL + "\r\nNữ\r\n - Áo thun\r\n + S:\r\n" + WOMEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_T_SHIRT_SIZE_XXL + "\r\n - Áo sơ mi:\r\n + S:\r\n" + WOMEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_SHIRT_SIZE_XXL
        else:
            return "Bạn thuộc size: " + sizeMan + " đối với nam, size: " + sizeWoman + " đối với nữ"
    elif type == "ask_about_size_shirt":
        sizeMan = detect_man_shirt_size(tall, heavy)
        sizeWoman = detect_woman_shirt_size(tall, heavy)
        if sizeMan == "NOT_FOUND" or sizeWoman == "NOT_FOUND":
            return "Không tìm thấy size phù hợp bạn tham khảo thông tin dưới đây: \r\n Nam\r\n - Áo thun\r\n + S:\r\n" + MEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_T_SHIRT_SIZE_XXL + "\r\n - Áo sơ mi:\r\n + S:\r\n" + MEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + MEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + MEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + MEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + MEN_SHIRT_SIZE_XXL + "\r\nNữ\r\n - Áo thun\r\n + S:\r\n" + WOMEN_T_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_T_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_T_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_T_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_T_SHIRT_SIZE_XXL + "\r\n - Áo sơ mi:\r\n + S:\r\n" + WOMEN_SHIRT_SIZE_S + "\r\n + M:\r\n" + WOMEN_SHIRT_SIZE_M + "\r\n + L:\r\n" + WOMEN_SHIRT_SIZE_L + "\r\n + XL:\r\n" + WOMEN_SHIRT_SIZE_XL + "\r\n + XXL:\r\n" + WOMEN_SHIRT_SIZE_XXL
        else:
            return "Bạn thuộc size: " + sizeMan + " đối với nam, size: " + sizeWoman + " đối với nữ"
    elif type == "ask_about_size_pants":
        sizeMan = detact_man_pants_size(tall, heavy)
        sizeWoman = detact_woman_pants_size(tall, heavy)
        if sizeMan == "NOT_FOUND" or sizeWoman == "NOT_FOUND":
            return "Không tìm thấy size phù hợp cho bạn"
        else:
            return "Bạn thuộc size: " + sizeMan + " đối với nam, size: " + sizeWoman + " đối với nữ"
    elif type == "ask_about_size_man_t_shirt":
        sizeMan = detect_man_t_shirt_size(tall, heavy)
        if sizeMan == "NOT_FOUND":
            return "Không tìm thấy size phù hợp bạn tham khảo thông tin dưới đây: \r\n S:\r\n" + MEN_T_SHIRT_SIZE_S + "\r\n - M:\r\n" + MEN_T_SHIRT_SIZE_M + "\r\n - L:\r\n" + MEN_T_SHIRT_SIZE_L + "\r\n - XL:\r\n" + MEN_T_SHIRT_SIZE_XL + "\r\n - XXL:\r\n" + MEN_T_SHIRT_SIZE_XXL
        else:
            return "Bạn thuộc size: " + sizeMan
    elif type == "ask_about_size_man_shirt":
        sizeMan = detect_man_shirt_size(tall, heavy)
        if sizeMan == "NOT_FOUND":
            return "Không tìm thấy size phù hợp bạn tham khảo thông tin dưới đây: \r\n S:\r\n" + MEN_SHIRT_SIZE_S + "\r\n - M:\r\n" + MEN_SHIRT_SIZE_M + "\r\n - L:\r\n" + MEN_SHIRT_SIZE_L + "\r\n - XL:\r\n" + MEN_SHIRT_SIZE_XL + "\r\n - XXL:\r\n" + MEN_SHIRT_SIZE_XXL
        else:
            return "Bạn thuộc size: " + sizeMan
    elif type == "ask_about_size_man_pants":
        sizeMan = detact_man_pants_size(tall, heavy)
        if sizeMan == "NOT_FOUND":
            return "Không tìm thấy size phù hợp cho bạn"
        else:
            return "Bạn thuộc size: " + sizeMan
    elif type == "ask_about_size_woman_t_shirt":
        sizeWoman = detect_woman_t_shirt_size(tall, heavy)
        if sizeWoman == "NOT_FOUND":
            return "Không tìm thấy size phù hợp bạn tham khảo thông tin dưới đây: \r\n S:\r\n" + WOMEN_T_SHIRT_SIZE_S + "\r\n - M:\r\n" + WOMEN_T_SHIRT_SIZE_M + "\r\n - L:\r\n" + WOMEN_T_SHIRT_SIZE_L + "\r\n - XL:\r\n" + WOMEN_T_SHIRT_SIZE_XL + "\r\n - XXL:\r\n" + WOMEN_T_SHIRT_SIZE_XXL
        else:
            return "Bạn thuộc size: " + sizeWoman
    elif type == "ask_about_size_woman_shirt":
        sizeWoman = detect_woman_shirt_size(tall, heavy)
        if sizeWoman == "NOT_FOUND":
            return "Không tìm thấy size phù hợp bạn tham khảo thông tin dưới đây: \r\n S:\r\n" + WOMEN_SHIRT_SIZE_S + "\r\n - M:\r\n" + WOMEN_SHIRT_SIZE_M + "\r\n - L:\r\n" + WOMEN_SHIRT_SIZE_L + "\r\n - XL:\r\n" + WOMEN_SHIRT_SIZE_XL + "\r\n - XXL:\r\n" + WOMEN_SHIRT_SIZE_XXL
        else:
            return "Bạn thuộc size: " + sizeWoman
    elif type == "ask_about_size_woman_pants":
        sizeWoman = detact_woman_pants_size(tall, heavy)
        if sizeWoman == "NOT_FOUND":
            return "Không tìm thấy size phù hợp cho bạn"
        else:
            return "Bạn thuộc size: " + sizeWoman
    return ""


categories = ["ao", "vay", "dam", "quan", "non", "mu"]
distinguishing_end_name = ["co size", "size",
                           "color", "co color", "con ban", "con", "co khong"]


def get_name_product_word(text):
    pos = 0
    position_start = -1
    total = len(categories)

    while pos < total:
        if categories[pos] in text:
            position_start = text.index(categories[pos])
            break
        pos += 1

    if position_start == -1:
        return ""

    pos = 0
    position_end = position_end = len(text)
    total = len(distinguishing_end_name)
    while pos < total:
        if distinguishing_end_name[pos] in text:
            index = text.index(distinguishing_end_name[pos])
            if index != -1 and index < position_end:
                position_end = index

        pos += 1

    result = ""
    while position_start < position_end:
        result += text[position_start]
        position_start += 1
    return result


def chatbox(message):
    message = remove_html(message)
    message = covert_unicode(message)
    message = message.lower()
    message = convert_keywords_to_english(message)
    message = no_accent_vietnamese(message)
    # xóa khoảng trắng thừa
    message = re.sub(r'\s+', ' ', message).strip()
    check = check_is_search_size(message)
    if check != "":
        return {"type": "msg", "data": check}

    ints = predict_class(model, classes, words, message)
    result = get_response(ints, intents)
    if result == "ask_product":
        size = ""
        color = ""
        product_name = ""
        # get size
        if "size" in message:
            size = get_word_behind_word(message, "size")
        # get color
        if "color" in message:
            color = get_word_behind_word(message, "color")
        product_name = get_name_product_word(message)
        return {"type": result, "data": {"productName": product_name, "color": color, "size": size}}
    elif result == "ask_about_size_t_shirt" or result == "ask_about_size_shirt" or result == "ask_about_size_pants" or result == "ask_about_size_man_t_shirt" or result == "ask_about_size_man_shirt" or result == "ask_about_size_man_pants" or result == "ask_about_size_woman_t_shirt" or result == "ask_about_size_woman_shirt" or result == "ask_about_size_woman_pants":
        return {"type": "msg", "data": detect_size(result, message)}
    elif result == "ask_slow_delivery" or result == "ask_how_to_buy" or result == "best_rate" or result == "best_view" or result == "best_sell" or result == "ask_brands" or "ask_categories" in result:
        return {"type": result}
    elif result == "person_bot_care":
        return {"type": "person_bot_care"}
    print(result)
    return {"type": "msg", "data": result}


# while True:
#     message = input("")
#     print(chatbox(message))


@app.route('/', methods=['GET'])
def home():
    return jsonify(message="success", data="Hello this is API of virtual assistant!", code=200)


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        print("[POST] --> Begin chat")
        data = request.get_json()
        message = data.get('message', '')
        print("Message: " + message)
        result = chatbox(message)
        print("---End---")
        return jsonify(message="success", data=result, code=200)
    except:
        print("error")
        return jsonify(message="Error", code=400)


app.run()
