<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('users', 'UserController@signUp')->name('users.signUp');

Route::post('access-tokens', 'UserController@authenticate');

Route::post('access-tokens/refresh', 'UserController@refreshJWT')->name('user.token.refresh');
Route::get('open', 'DataController@open');

Route::group(['middleware' => ['jwt.verify']], function() {
    Route::get('user', 'UserController@getAuthenticatedUser');
    Route::get('me', 'UserController@getAuthenticatedUser');
    Route::get('closed', 'DataController@closed');

    Route::get('ideas', 'IdeaController@getIdeas')->name('ideas.get'); // Get a page of ideas (1 page = 10 ideas)
    Route::post('ideas', 'IdeaController@create')->name('ideas.add'); // Create idea
    Route::delete('/ideas/{id}','IdeaController@delete')->name('ideas.delete'); // Delete idea
    Route::put('/ideas/{id}', 'IdeaController@update')->name('ideas.update');

});

