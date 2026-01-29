import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data } = await supabase
        .from('movimentacoes')
        .select('*')
    return res.status(200).json(data)
    }

    if (req.method === 'POST') {
        const { tipo, data, valor, descricao } = req.body

        await supabase
            .from('movimentacoes')
            .insert([{ tipo, data, valor, descricao }])

        return res.status(201).end()
    }
}