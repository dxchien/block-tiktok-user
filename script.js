// ==UserScript==
// @name         Auto block user by content
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       dxchien
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @updateURL    https://github.com/dxchien/block-tiktok-user/raw/main/script.js
// @downloadURL  https://github.com/dxchien/block-tiktok-user/raw/main/script.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    showNotification("Auto block user by content");

    setInterval(()=> {
        var badText = ["BẮC KÌ", "BẮC KỲ", "PARKI", "PARKY", "PAKY", "PACKAY", "PAKE", "PAAKY", "PAAAKY", , "PAAAAKY"];

        console.log("Start scan dog............................");
        var cssId = getCssId(document.documentElement.innerHTML, "-DivCommentContentContainer");
        console.log("cssClass=" + "css-" + cssId + "-DivCommentContentContainer");

        var comments = document.getElementsByClassName("css-" + cssId + "-DivCommentContentContainer");
        console.log("Found " + comments.length + " comment");

        for (let item of comments) {
            badText.forEach(text => {
                if(item.innerHTML.toUpperCase().indexOf(text) != -1) {
                    var userName = item.firstChild.attributes["href"].value.substring(2);
                    blockUser(userName);
                    console.log("Found dog: " + userName);
                    showNotification("Found dog: " + userName);
                    item.innerHTML = "<span style='color:red' ><b>Blocked Dog: " + userName + "</b></span>";
                    return;
                }
            });
        }
    }, 5000);

    function blockUser(userName) {
        var userPage = getHtml("https://www.tiktok.com/@" + userName);
        var csrfToken = getCsrfToken(userPage);
        var userId = getUserId(userPage);

        console.log("userId=" + userId);

        var urlBlock = "https://www.tiktok.com/api/user/block/?WebIdLastTime=1640775084&aid=1988&app_language=vi-VN&app_name=tiktok_web&block_type=1&browser_language=vi-VN&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F122.0.0.0%20Safari%2F537.36&channel=tiktok_web&cookie_enabled=true&device_id=7047075299247834626&device_platform=web_pc&focus_state=true&from_page=user&history_len=1&is_fullscreen=false&is_page_visible=true&os=windows&priority_region=VN&referer=https%3A%2F%2Fwww.tiktok.com%2F%40thanglongtvonline%2Fvideo%2F7337630375029542177&region=VN&root_referer=https%3A%2F%2Fwww.tiktok.com%2F%40thanglongtvonline%2Fvideo%2F7337630375029542177&screen_height=1080&screen_width=1920&sec_user_id=" + userId + "&source=3&tz_name=Asia%2FBangkok&webcast_language=vi-VN";
        const xhr = new XMLHttpRequest();
        xhr.open("POST", urlBlock, false);
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        xhr.setRequestHeader("Tt-Csrf-Token", csrfToken);
        xhr.send();

        var result = JSON.parse(xhr.response);
        if (result["block_status"] == 1) {
            console.log("Blocked dog: " + userName);
        } else {
            console.log(result);
        }
    }

    function getHtml(link) {
        console.log("Get HTML Page: " + link)
        const xhr = new XMLHttpRequest();
        xhr.open("GET", link, false);
        xhr.setRequestHeader("Content-Type", "text/html; charset=UTF-8");
        xhr.send();
        xhr.onload = function() {
            if (xhr.status != 200) {
                console.log(`Error ${xhr.status}: ${xhr.statusText}`);
            }
        };
        return xhr.response;
    }

    function getCssId(html, suffix) {
        var t1 = html.substring(0, html.indexOf(suffix));
        return t1.substring(t1.lastIndexOf("css-") + 4);
    }

    function getCsrfToken(html) {
        var t1 = html.substring(html.indexOf('csrfToken":"') + 12);
        return t1.substring(0, t1.indexOf('"'));
    }

    function getUserId(html) {
        var t1 = html.substring(html.lastIndexOf('secUid":"') + 9);
        return t1.substring(0, t1.indexOf('"'));
    }

    // Function to show notification
    function showNotification(text) {
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications.");
        }
        // Check if notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(text);
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(text);
                }
            });
        }
    }
})();

