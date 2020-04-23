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
// User login
Route::post('access-tokens', 'UserController@authenticate');
// Refresh JWT
Route::post('access-tokens/refresh', 'UserController@refreshJWT')->name('user.token.refresh');
// User logout
Route::delete('access-tokens', 'UserController@logout')->name('user.logout');


Route::get('open', 'DataController@open');

Route::group(['middleware' => ['jwt.verify']], function() {
    Route::get('user', 'UserController@getAuthenticatedUser');
    // Current User
    Route::get('me', 'UserController@getAuthenticatedUser');
    Route::get('closed', 'DataController@closed');
    // Get a page of ideas (1 page = 10 ideas)
    Route::get('ideas', 'IdeaController@getIdeas')->name('ideas.get');
    // Create idea
    Route::post('ideas', 'IdeaController@create')->name('ideas.add');
    // Delete idea
    Route::delete('/ideas/{id}','IdeaController@delete')->name('ideas.delete');
    // Update idea
    Route::put('/ideas/{id}', 'IdeaController@update')->name('ideas.update');

});

