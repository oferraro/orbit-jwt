<?php

namespace App\Http\Controllers;

use App\Idea;
use Carbon\Carbon;
use Facade\Ignition\Support\Packagist\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IdeaController extends Controller
{

    public function create(Request $request) {
        // TODO: Use uuid for IDs instead of autonumeric ones
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:255',
            'impact' => 'required|integer|between:1,10',
            'ease' => 'required|integer|between:1,10',
            'confidence' => 'required|integer|between:1,10'
            ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $newIdea = new Idea;
        $newIdea->content = $request->get('content');
        $newIdea->impact = $request->get('impact');
        $newIdea->ease = $request->get('ease');
        $newIdea->confidence = $request->get('confidence');
        $newIdea->save();
        $idea = $this->formatIdea($newIdea->toArray());

        return response()->json($idea, 201);
    }

    public function delete($id) { // route: /ideas/tg2b9xuyy
        $idea = Idea::find($id);
        if ($idea) {
            $idea->delete();
            return response()->json([], 204);
        }
    }

    public function getIdeas(Request $request) { // Route: GET /ideas?page=1 (ideas paginated) Get a page of ideas (1 page = 10 ideas)
        $limit = 10;
        $offset = 0;
        if ($request->has('page') && is_numeric($request->get('page'))) {
            $offset = ($request->get('page') - 1) * $limit;
        }
        // TODO: get average and set timestamp format for created_at using the ORM
        $ideas = Idea::select(
            'id',
            'content',
            'impact',
            'ease',
            'confidence',
            'average_score',
            'created_at'
            )->offset($offset)->limit($limit)->get();
        $paginatedIdeas = [];
        foreach ($ideas as $i) {
            $idea = $this->formatIdea($i->toArray());
            $paginatedIdeas[] = $idea;
        }
        return response()->json($paginatedIdeas);
    }

    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:255',
            'impact' => 'required|integer|between:1,10',
            'ease' => 'required|integer|between:1,10',
            'confidence' => 'required|integer|between:1,10'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $idea = Idea::find($id);
        if ($idea) {
            $idea->content = $request->get('content');
            $idea->impact = $request->get('impact');
            $idea->ease = $request->get('ease');
            $idea->confidence = $request->get('confidence');
            $idea->update();
            
            $ideaResponse = $this->formatIdea($idea->toArray());
            return response()->json($ideaResponse);
        }
    }

    private function formatIdea($i){
        $idea['id'] = $i['id'];
        $idea["content"] = $i["content"];
        $idea["impact"] = $i["impact"];
        $idea["ease"] = $i["ease"];
        $idea["confidence"] = $i["confidence"];
        $points = [$i['impact'], $i['ease'], $i['confidence']];
        $average = array_sum($points) / count($points);
        $idea['average_score'] = $average;
        $date = Carbon::parse($i['created_at']);
        $idea['created_at'] = ($date->format('U'));
        return $idea;
    }
}
