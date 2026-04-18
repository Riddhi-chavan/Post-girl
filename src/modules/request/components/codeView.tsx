'use client'
import React, { useState } from 'react'
import { useRequestPlaygroundStore } from '../store/useRequestStore'
import { Copy, Check } from 'lucide-react'

type Language = 'curl' | 'js_fetch' | 'axios' | 'python' | 'go' | 'php'

const LANGUAGES: { id: Language; label: string; badge: string }[] = [
    { id: 'curl', label: 'cURL', badge: 'bash' },
    { id: 'js_fetch', label: 'JS Fetch', badge: 'javascript' },
    { id: 'axios', label: 'Axios', badge: 'javascript' },
    { id: 'python', label: 'Python', badge: 'python' },
    { id: 'go', label: 'Go', badge: 'go' },
    { id: 'php', label: 'PHP', badge: 'php' },
]

function generateSnippet(lang: Language, method: string, url: string, headers: string, body: string): string {
    // Parse headers [{key,value}] → object
    let headersObj: Record<string, string> = {}
    try {
        const arr = JSON.parse(headers || '[]')
        arr.forEach((h: any) => { if (h.key) headersObj[h.key] = h.value })
    } catch { }

    // Parse body
    let bodyObj: any = null
    try { bodyObj = JSON.parse(body || '') } catch { }
    const bodyStr = bodyObj ? JSON.stringify(bodyObj, null, 2) : body || ''
    const bodyOneLine = bodyObj ? JSON.stringify(bodyObj) : body || ''

    const hasBody = !!bodyStr && method !== 'GET'
    const headerEntries = Object.entries(headersObj)
    const headersFormatted = headerEntries.map(([k, v]) => `"${k}": "${v}"`).join(',\n    ')
    const curlHeaders = headerEntries.map(([k, v]) => `  -H "${k}: ${v}" \\`).join('\n')

    switch (lang) {
        case 'curl':
            return `curl -X ${method} ${url} \\
${curlHeaders ? curlHeaders + '\n' : ''}${hasBody ? `  -d '${bodyOneLine}'` : ''}`.trim()

        case 'js_fetch':
            return `const response = await fetch("${url}", {
  method: "${method}",${headerEntries.length ? `\n  headers: {\n    ${headersFormatted}\n  },` : ''}${hasBody ? `\n  body: JSON.stringify(${bodyStr})` : ''}
});

const data = await response.json();
console.log(data);`

        case 'axios':
            return `import axios from "axios";

const { data } = await axios.${method.toLowerCase()}(
  "${url}"${hasBody ? `,\n  ${bodyStr}` : ''},
  { headers: { ${headersFormatted || '"Content-Type": "application/json"'} } }
);

console.log(data);`

        case 'python':
            return `import requests

response = requests.${method.toLowerCase()}(
    "${url}",${hasBody ? `\n    json=${bodyStr.replace(/"/g, '"')},` : ''}${headerEntries.length ? `\n    headers={${headerEntries.map(([k, v]) => `"${k}": "${v}"`).join(', ')}}` : ''}
)

print(response.json())`

        case 'go':
            return `package main

import (
  "bytes"
  "encoding/json"
  "fmt"
  "net/http"
)

func main() {
  payload, _ := json.Marshal(${bodyOneLine || 'nil'})

  req, _ := http.NewRequest("${method}", "${url}", bytes.NewBuffer(payload))
${headerEntries.map(([k, v]) => `  req.Header.Set("${k}", "${v}")`).join('\n')}
  client := &http.Client{}
  resp, _ := client.Do(req)
  defer resp.Body.Close()
  fmt.Println(resp.Status)
}`

        case 'php':
            return `<?php

$ch = curl_init("${url}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");
curl_setopt($ch, CURLOPT_HTTPHEADER, [${headerEntries.map(([k, v]) => `"${k}: ${v}"`).join(', ')}]);
${hasBody ? `curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(${bodyStr}));\n` : ''}
$response = curl_exec($ch);
curl_close($ch);
echo $response;`
    }
}

const methodColors: Record<string, string> = {
    GET: 'bg-green-900 text-green-300',
    POST: 'bg-blue-900 text-blue-300',
    PUT: 'bg-yellow-900 text-yellow-300',
    PATCH: 'bg-orange-900 text-orange-300',
    DELETE: 'bg-red-900 text-red-300',
}

const CodeViewer = () => {
    const { tabs, activeTabId } = useRequestPlaygroundStore()
    const activeTab = tabs.find(t => t.id === activeTabId)
    const [lang, setLang] = useState<Language>('curl')
    const [copied, setCopied] = useState(false)

    if (!activeTab) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-sm gap-2">
                <span>No active request</span>
                <span className="text-xs text-zinc-600">Open a request to see its code</span>
            </div>
        )
    }

    const snippet = generateSnippet(
        lang,
        activeTab.method,
        activeTab.url || '',
        activeTab.headers || '',
        activeTab.body || ''
    )

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col h-full p-4 gap-3">
            {/* Request info bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-800">
                <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${methodColors[activeTab.method] || 'bg-zinc-700 text-zinc-300'}`}>
                    {activeTab.method}
                </span>
                <span className="text-xs text-zinc-400 font-mono truncate">
                    {activeTab.url || 'No URL set'}
                </span>
            </div>

            {/* Language tabs */}
            <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map(l => (
                    <button
                        key={l.id}
                        onClick={() => setLang(l.id)}
                        className={`px-3 py-1 text-xs rounded-md border transition-colors ${lang === l.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-transparent text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:border-zinc-600'
                            }`}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* Code block */}
            <div className="flex-1 rounded-lg overflow-hidden border border-zinc-800 bg-[#1e1e1e]">
                <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-zinc-700">
                    <span className="text-xs text-zinc-500 font-mono">
                        {LANGUAGES.find(l => l.id === lang)?.badge}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        {copied
                            ? <><Check className="w-3 h-3 text-green-400" /> Copied</>
                            : <><Copy className="w-3 h-3" /> Copy</>
                        }
                    </button>
                </div>
                <pre className="p-4 text-xs font-mono text-[#d4d4d4] overflow-auto whitespace-pre leading-relaxed h-full">
                    {snippet}
                </pre>
            </div>
        </div>
    )
}

export default CodeViewer